"use client";

import { ProductImage } from "@/app/types/product";
import {
  ImagePlus,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ProductImagesProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ProductImages({
  images,
  onChange,
}: ProductImagesProps) {
  const [uploading, setUploading] = useState(false);

  // ==========================================
  // UPLOAD IMAGE TO BACKEND
  // ==========================================

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/admin/uploads",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "Failed to upload image"
      );
    }

    return result.data.imageUrl;
  }

  // ==========================================
  // HANDLE FILE SELECT
  // ==========================================

  async function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return;

    const selectedFiles = Array.from(
      event.target.files
    ).slice(0, 3 - images.length);

    if (selectedFiles.length === 0) {
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadedImages: ProductImage[] = [];

      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];

        // ------------------------------
        // Validate size
        // ------------------------------

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `${file.name} is larger than 5MB`
          );
        }

        // ------------------------------
        // Upload to API
        // ------------------------------

        const imageUrl = await uploadImage(file);

        uploadedImages.push({
          id:
            Date.now() + index,

          // Actual backend URL
          url: imageUrl,

          // Used by ProductForm
          imageUrl: imageUrl,

          // Original filename
          altText: file.name,

          sortOrder:
            images.length + index,

          // First image = main
          // Second image = hover
          isHover:
            images.length + index === 1,
        });
      }

      onChange([
        ...images,
        ...uploadedImages,
      ]);
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );
    } finally {
      setUploading(false);

      // Allows selecting the same file again
      event.target.value = "";
    }
  }

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  function removeImage(id: number) {
    const updatedImages = images
      .filter(
        (image) => image.id !== id
      )
      .map((image, index) => ({
        ...image,

        sortOrder: index,

        // Second image is hover
        isHover: index === 1,
      }));

    onChange(updatedImages);
  }

  // ==========================================
  // SET HOVER IMAGE
  // ==========================================

  function setHoverImage(id: number) {
    const updatedImages = images.map(
      (image) => ({
        ...image,

        isHover:
          image.id === id,
      })
    );

    onChange(updatedImages);
  }

  return (
    <div className="bg-white p-8">
      {/* ======================================
          DESCRIPTION
      ====================================== */}

      <div className="text-center">
        <p className="text-[13px] font-medium text-[#09213f]">
          Upload up to 3 product images.
          The first image will be used as
          the main image.
        </p>

        <p className="mt-1 text-[12px] text-[#09213f]">
          JPG, PNG or WebP. Maximum 5MB per
          image.
        </p>
      </div>

      {/* ======================================
          IMAGES
      ====================================== */}

      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {/* ====================================
            UPLOAD BUTTON
        ==================================== */}

        {images.length < 3 && (
          <label
            className={`
              flex
              h-[150px]
              w-[150px]
              flex-col
              items-center
              justify-center
              border
              border-[#dedede]
              bg-white
              ${
                uploading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-[#fafafa]"
              }
            `}
          >
            {uploading ? (
              <>
                <Loader2
                  size={30}
                  strokeWidth={1.4}
                  className="animate-spin text-gray-500"
                />

                <span className="mt-3 text-[10px] text-[#09213f]">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <ImagePlus
                  size={30}
                  strokeWidth={1.4}
                  className="text-gray-500"
                />

                <span className="mt-3 text-[10px] text-[#09213f]">
                  Drop your image here, or
                </span>

                <span className="text-[10px] text-[#09213f]">
                  select Click to browse
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={uploading}
              className="hidden"
              onChange={handleFiles}
            />
          </label>
        )}

        {/* ====================================
            UPLOADED IMAGES
        ==================================== */}

        {images.map(
          (image, index) => (
            <div
              key={image.id}
              className="relative"
            >
              {/* IMAGE */}

              <div className="relative h-[150px] w-[150px] overflow-hidden border border-[#dedede] bg-white">
                <img
                  src={
                    image.imageUrl ??
                    image.url
                  }
                  alt={
                    image.altText ??
                    `Product ${index + 1}`
                  }
                  className="h-full w-full object-cover"
                />

                {/* MAIN / HOVER BADGE */}

                <div className="absolute left-2 top-2">
                  <span className="bg-black/75 px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-white">
                    {index === 0
                      ? "Main"
                      : image.isHover
                      ? "Hover"
                      : `Image ${index + 1}`}
                  </span>
                </div>
              </div>

              {/* IMAGE NAME */}

              <p className="mt-2 max-w-[150px] truncate text-center text-[10px]">
                {image.altText ??
                  `product-${index + 1}.webp`}
              </p>

              {/* ACTIONS */}

              <div className="mt-1 flex justify-center gap-3">
                {/* SET HOVER */}

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setHoverImage(
                        image.id
                      )
                    }
                    title={
                      image.isHover
                        ? "Hover image"
                        : "Set as hover image"
                    }
                    className={`
                      ${
                        image.isHover
                          ? "text-[#c90000]"
                          : "text-gray-600"
                      }
                      hover:text-black
                    `}
                  >
                    <Upload
                      size={14}
                    />
                  </button>
                )}

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeImage(
                      image.id
                    )
                  }
                  title="Remove image"
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ======================================
          UPLOAD STATUS
      ====================================== */}

      {uploading && (
        <p className="mt-6 text-center text-[11px] text-gray-500">
          Please wait while your images
          are being uploaded...
        </p>
      )}
    </div>
  );
}