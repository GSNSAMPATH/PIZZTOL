import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: auth.message,
      },
      {
        status: auth.status,
      }
    );
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");

    // =====================================================
    // VALIDATE FILE
    // =====================================================

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WebP images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // READ ORIGINAL IMAGE
    // =====================================================

    const inputBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    // =====================================================
    // PROCESS IMAGE WITH SHARP
    //
    // - Auto rotate based on EXIF
    // - Resize large images
    // - Convert everything to WebP
    // - Normalize image data
    // =====================================================

    const outputBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 4,
      })
      .toBuffer();

    // =====================================================
    // GENERATE UNIQUE FILE NAME
    // =====================================================

    const filename =
      `${crypto.randomUUID()}.webp`;

    // =====================================================
    // UPLOAD DIRECTORY
    // =====================================================

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    // =====================================================
    // SAVE PROCESSED IMAGE
    // =====================================================

    const filePath = path.join(
      uploadDirectory,
      filename
    );

    await writeFile(
      filePath,
      outputBuffer
    );

    // =====================================================
    // PUBLIC IMAGE URL
    // =====================================================

    const imageUrl =
      `/uploads/products/${filename}`;

    console.log(
      "Product image uploaded:",
      {
        originalName: file.name,
        originalType: file.type,
        originalSize: file.size,
        outputName: filename,
        outputSize: outputBuffer.length,
        imageUrl,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Image uploaded successfully",

        data: {
          imageUrl,
          filename,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Image upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload image",
      },
      {
        status: 500,
      }
    );
  }
}