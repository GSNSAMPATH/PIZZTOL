import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { generateSlug } from "@/lib/slug";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idParam = searchParams.get("id");
//     const name = searchParams.get("name");
//     const id = idParam ? Number(idParam) : undefined;

//     if (idParam && Number.isNaN(id)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid product ID",
//         },
//         { status: 400 }
//       );
//     }

//     const products = await prisma.product.findMany({
//       where: {
//         isActive: true,
//         ...(id
//           ? {
//               id,
//             }
//           : {}),

//         ...(name
//           ? {
//               name: {
//                 contains: name,
//                 mode: "insensitive",
//               },
//             }
//           : {}),
//       },

//       include: {
//         category: true,

//         variants: {
//           include: {
//             size: true,
//             // color: true,
//             volume: true,
//           },

//           orderBy: {
//             id: "asc",
//           },
//         },

//         images: {
//           orderBy: {
//             sortOrder: "asc",
//           },
//         },
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       count: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error("GET /api/products error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch products",
//       },
//       { status: 500 }
//     );
//   }
// }

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
    const body = await request.json();

    const {
      name,
      brand,
      description,
      categoryId,
      variants,
      images,
      productDetails,
      careInstructions,
    } = body;

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(variants) ||
      variants.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one product variant is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(images)) {
      return NextResponse.json(
        {
          success: false,
          message: "Images must be an array",
        },
        {
          status: 400,
        }
      );
    }

    if (
      productDetails !== undefined &&
      !Array.isArray(productDetails)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product details must be an array",
        },
        {
          status: 400,
        }
      );
    }

    if (
      careInstructions !== undefined &&
      !Array.isArray(careInstructions)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Care instructions must be an array",
        },
        {
          status: 400,
        }
      );
    }

    const cleanedProductDetails: string[] =
      Array.isArray(productDetails)
        ? productDetails
            .filter(
              (item: unknown) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
            .map(
              (item: string) =>
                item.trim()
            )
        : [];

    const cleanedCareInstructions: string[] =
      Array.isArray(careInstructions)
        ? careInstructions
            .filter(
              (item: unknown) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
            .map(
              (item: string) =>
                item.trim()
            )
        : [];

    // const baseSlug =
    //   generateSlug(name);

    // if (!baseSlug) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message:
    //         "Unable to generate product slug",
    //     },
    //     {
    //       status: 400,
    //     }
    //   );
    // }

    const productName = String(name ?? "").trim();

    console.log("PRODUCT NAME:", productName);

    const baseSlug =
      generateSlug(productName);

    console.log("GENERATED SLUG:", baseSlug);

    if (!baseSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to generate product slug",
        },
        {
          status: 400,
        }
      );
    }

    

    let slug = baseSlug;
    let counter = 2;

    while (
      await prisma.product.findUnique({
        where: {
          slug,
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(categoryId),
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    const skuSet =
      new Set<string>();

    for (const variant of variants) {

      if (
        !variant.sku ||
        !String(variant.sku).trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Every variant must have a SKU",
          },
          {
            status: 400,
          }
        );
      }

      const sku =
        String(
          variant.sku
        ).trim();

      if (skuSet.has(sku)) {
        return NextResponse.json(
          {
            success: false,
            message: `Duplicate SKU: ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      skuSet.add(sku);

      if (
        variant.price === undefined ||
        variant.price ===  null ||
        variant.price === ""
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Price is required for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      const price = Number(variant.price);

      if (
        Number.isNaN(price) || price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid price for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      const stockQty = Number(variant.stockQty ?? 0);

      if (
        Number.isNaN(stockQty) || stockQty < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid stock quantity for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      const existingVariant = await prisma.productVariant.findUnique({where: {sku,},});

      if (existingVariant) {
        return NextResponse.json(
          {
            success: false,
            message: `SKU already exists: ${sku}`,
          },
          {
            status: 409,
          }
        );
      }
    }

    const product = await prisma.product.create({
        data: {
          name: name.trim(),
          slug,
          brand:
            typeof brand === "string" && brand.trim()? brand.trim() : null,

          description:
            typeof description === "string" && description.trim()? description.trim() : null,

          categoryId:
            Number(categoryId),

          isActive: true,

          productDetails: cleanedProductDetails,

          careInstructions: cleanedCareInstructions,

          variants: {
              create: variants.map(
                (variant: any) => ({
                  sku: String(
                    variant.sku
                  ).trim(),

                  stockQty: Number(
                    variant.stockQty ?? 0
                  ),

                  price: Number(
                    variant.price ?? 0
                  ),

                  discountPercent: Number(
                    variant.discountPercent ?? 0
                  ),

                  salePrice:
                    variant.salePrice !== null &&
                    variant.salePrice !== undefined &&
                    variant.salePrice !== ""
                      ? Number(
                          variant.salePrice
                        )
                      : null,

                  // ==========================================
                  // COLOR
                  // ==========================================

                  colorName:
                    variant.colorName ??
                    variant.color ??
                    null,

                  colorCode:
                    variant.colorCode ??
                    null,

                  // ==========================================
                  // SIZE
                  // ==========================================

                  sizeId:
                    variant.sizeId !== null &&
                    variant.sizeId !== undefined &&
                    variant.sizeId !== ""
                      ? Number(
                          variant.sizeId
                        )
                      : null,

                  // ==========================================
                  // VOLUME
                  // ==========================================

                  volumeId:
                    variant.volumeId !== null &&
                    variant.volumeId !== undefined &&
                    variant.volumeId !== ""
                      ? Number(
                          variant.volumeId
                        )
                      : null,
                })
              ),
            },

          images: {
            create:
              images.map(
                (
                  image: any,
                  index: number
                ) => ({
                  imageUrl:
                    String(
                      image.imageUrl
                    ),

                  altText:
                    image.altText !==
                      undefined &&
                    image.altText !==
                      null
                      ? String(
                          image.altText
                        )
                      : null,

                  sortOrder:
                    image.sortOrder !==
                      undefined
                      ? Number(
                          image.sortOrder
                        )
                      : index,

                  isHover:
                    Boolean(
                      image.isHover
                    ),
                })
              ),
          },
        },

        include: {
          category: true,

          variants: {
            include: {
              size: true,
              volume: true,
            },

            orderBy: {
              id: "asc",
            },
          },

          images: {
            orderBy: {
              sortOrder:
                "asc",
            },
          },
        },
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Product created successfully",

        data: product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}


// export async function GETPRODUCT(request: Request) {
//   try {
//     const { searchParams } =
//       new URL(request.url);

//     const idParam =
//       searchParams.get("id");

//     const name =
//       searchParams.get("name");


//     if (idParam) {
//       const id = Number(idParam);

//       if (
//         !Number.isInteger(id) ||
//         id <= 0
//       ) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Invalid product ID",
//           },
//           {
//             status: 400,
//           }
//         );
//       }

//       const product =
//         await prisma.product.findUnique({
//           where: {
//             id,
//           },

//           include: {
//             category: true,

//             variants: {
//               include: {
//                 size: true,
//                 volume: true,
//               },

//               orderBy: {
//                 id: "asc",
//               },
//             },

//             images: {
//               orderBy: {
//                 sortOrder: "asc",
//               },
//             },
//           },
//         });

//       if (!product) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Product not found",
//           },
//           {
//             status: 404,
//           }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         data: product,
//       });
//     }

//     const products =
//       await prisma.product.findMany({
//         where: {
//           isActive: true,

//           ...(name
//             ? {
//                 name: {
//                   contains: name,
//                   mode: "insensitive",
//                 },
//               }
//             : {}),
//         },

//         include: {
//           category: true,

//           variants: {
//             include: {
//               size: true,
//               volume: true,
//             },

//             orderBy: {
//               id: "asc",
//             },
//           },

//           images: {
//             orderBy: {
//               sortOrder: "asc",
//             },
//           },
//         },

//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//     return NextResponse.json({
//       success: true,
//       count: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error(
//       "GET /api/products error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to fetch products",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


// export async function GET(
//   request: Request
// ) {
//   try {
//     const { searchParams } =
//       new URL(request.url);

//     const idParam =
//       searchParams.get("id");

//     const name =
//       searchParams.get("name");

//     // =====================================================
//     // GET SINGLE PRODUCT
//     // =====================================================

//     if (idParam) {
//       const id = Number(idParam);

//       if (
//         !Number.isInteger(id) ||
//         id <= 0
//       ) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Invalid product ID",
//           },
//           {
//             status: 400,
//           }
//         );
//       }

//       const product =
//         await prisma.product.findUnique({
//           where: {
//             id,
//           },

//           include: {
//             category: true,

//             variants: {
//               include: {
//                 size: true,
//                 volume: true,
//               },

//               orderBy: {
//                 id: "asc",
//               },
//             },

//             images: {
//               orderBy: {
//                 sortOrder: "asc",
//               },
//             },
//           },
//         });

//       if (!product) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Product not found",
//           },
//           {
//             status: 404,
//           }
//         );
//       }

//       console.log(
//         "GET SINGLE PRODUCT:",
//         JSON.stringify(
//           product,
//           null,
//           2
//         )
//       );

//       return NextResponse.json({
//         success: true,
//         data: product,
//       });
//     }

//     // =====================================================
//     // GET ALL PRODUCTS
//     // =====================================================

//     const products =
//       await prisma.product.findMany({
//         where: {
//           isActive: true,

//           ...(name
//             ? {
//                 name: {
//                   contains: name,
//                   mode: "insensitive",
//                 },
//               }
//             : {}),
//         },

//         include: {
//           category: true,

//           variants: {
//             include: {
//               size: true,
//               volume: true,
//             },

//             orderBy: {
//               id: "asc",
//             },
//           },

//           images: {
//             orderBy: {
//               sortOrder: "asc",
//             },
//           },
//         },

//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//     return NextResponse.json({
//       success: true,
//       count: products.length,
//       data: products,
//     });

//   } catch (error) {
//     console.error(
//       "GET /api/products error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to fetch products",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const idParam =
      searchParams.get("id");

    const name =
      searchParams.get("name");

    const categoryIdParam =
      searchParams.get("categoryId");

    // =====================================================
    // GET SINGLE PRODUCT
    // =====================================================

    if (idParam) {
      const id = Number(idParam);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product ID",
          },
          {
            status: 400,
          }
        );
      }

      const product =
        await prisma.product.findUnique({
          where: {
            id,
          },

          include: {
            category: true,

            variants: {
              include: {
                size: true,
                volume: true,
              },

              orderBy: {
                id: "asc",
              },
            },

            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        });

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        success: true,
        data: product,
      });
    }

    // =====================================================
    // CATEGORY ID VALIDATION
    // =====================================================

    let categoryId: number | undefined;

    if (
      categoryIdParam &&
      categoryIdParam.trim()
    ) {
      const parsedCategoryId =
        Number(categoryIdParam);

      if (
        !Number.isInteger(
          parsedCategoryId
        ) ||
        parsedCategoryId <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid category ID",
          },
          {
            status: 400,
          }
        );
      }

      categoryId =
        parsedCategoryId;
    }

    // =====================================================
    // GET PRODUCTS
    // =====================================================

    const products =
      await prisma.product.findMany({
        where: {
          isActive: true,

          // ============================================
          // CATEGORY ID FILTER
          // ============================================

          ...(categoryId !== undefined
            ? {
                categoryId,
              }
            : {}),

          // ============================================
          // NAME SEARCH
          // ============================================

          ...(name &&
          name.trim()
            ? {
                name: {
                  contains:
                    name.trim(),
                  mode: "insensitive",
                },
              }
            : {}),
        },

        include: {
          category: true,

          variants: {
            include: {
              size: true,
              volume: true,
            },

            orderBy: {
              id: "asc",
            },
          },

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error(
      "GET /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}


export async function PUT(request: Request) {
  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

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
    // ==========================================
    // GET PRODUCT ID
    // ==========================================

    const { searchParams } =
      new URL(request.url);

    const idParam =
      searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const productId = Number(idParam);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // FIND EXISTING PRODUCT
    // ==========================================

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        include: {
          variants: true,
          images: true,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // READ BODY
    // ==========================================

    const body = await request.json();

    const {
      name,
      brand,
      description,
      categoryId,
      variants,
      images,
      productDetails,
      careInstructions,
      isActive,
    } = body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        {
          status: 400,
        }
      );
    }

    const numericCategoryId =
      Number(categoryId);

    if (
      !Number.isInteger(
        numericCategoryId
      ) ||
      numericCategoryId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(variants) ||
      variants.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one product variant is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(images)) {
      return NextResponse.json(
        {
          success: false,
          message: "Images must be an array",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // PRODUCT DETAILS
    // ==========================================

    if (
      productDetails !== undefined &&
      !Array.isArray(productDetails)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product details must be an array",
        },
        {
          status: 400,
        }
      );
    }

    const cleanedProductDetails =
      Array.isArray(productDetails)
        ? productDetails
            .filter(
              (item: unknown) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
            .map(
              (item: string) =>
                item.trim()
            )
        : [];

    // ==========================================
    // CARE INSTRUCTIONS
    // ==========================================

    if (
      careInstructions !== undefined &&
      !Array.isArray(careInstructions)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Care instructions must be an array",
        },
        {
          status: 400,
        }
      );
    }

    const cleanedCareInstructions =
      Array.isArray(careInstructions)
        ? careInstructions
            .filter(
              (item: unknown) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
            .map(
              (item: string) =>
                item.trim()
            )
        : [];

    // ==========================================
    // VALIDATE CATEGORY
    // ==========================================

    const category =
      await prisma.category.findUnique({
        where: {
          id: numericCategoryId,
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // GENERATE SLUG
    // ==========================================

    let slug =
      existingProduct.slug;

    if (
      existingProduct.name
        .trim()
        .toLowerCase() !==
      name.trim().toLowerCase()
    ) {
      const baseSlug =
        generateSlug(name);

      if (!baseSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to generate product slug",
          },
          {
            status: 400,
          }
        );
      }

      slug = baseSlug;

      let counter = 2;

      while (true) {
        const productWithSlug =
          await prisma.product.findFirst({
            where: {
              slug,
              NOT: {
                id: productId,
              },
            },
          });

        if (!productWithSlug) {
          break;
        }

        slug =
          `${baseSlug}-${counter}`;

        counter++;
      }
    }

    // ==========================================
    // VALIDATE VARIANTS
    // ==========================================

    const skuSet =
      new Set<string>();

    for (const variant of variants) {
      // ========================================
      // SKU
      // ========================================

      if (
        !variant.sku ||
        !String(variant.sku).trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Every variant must have a SKU",
          },
          {
            status: 400,
          }
        );
      }

      const sku =
        String(
          variant.sku
        ).trim();

      // ========================================
      // DUPLICATE SKU
      // ========================================

      if (skuSet.has(sku)) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate SKU: ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      skuSet.add(sku);

      // ========================================
      // PRICE
      // ========================================

      if (
        variant.price === undefined ||
        variant.price === null ||
        variant.price === ""
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Price is required for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      const price =
        Number(variant.price);

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid price for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      // ========================================
      // DISCOUNT
      // ========================================

      const discountPercent =
        Number(
          variant.discountPercent ??
            0
        );

      if (
        !Number.isFinite(
          discountPercent
        ) ||
        discountPercent < 0 ||
        discountPercent > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid discount for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      // ========================================
      // SALE PRICE
      // ========================================

      const calculatedSalePrice =
        price -
        price *
          (discountPercent / 100);

      // ========================================
      // STOCK
      // ========================================

      const stockQty =
        Number(
          variant.stockQty ?? 0
        );

      if (
        !Number.isFinite(stockQty) ||
        stockQty < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid stock quantity for variant ${sku}`,
          },
          {
            status: 400,
          }
        );
      }

      // ========================================
      // SIZE
      // ========================================

      let sizeId: number | null =
        null;

      if (
        variant.sizeId !==
          null &&
        variant.sizeId !==
          undefined &&
        variant.sizeId !== ""
      ) {
        sizeId =
          Number(
            variant.sizeId
          );

        if (
          !Number.isInteger(
            sizeId
          ) ||
          sizeId <= 0
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Invalid size for variant ${sku}`,
            },
            {
              status: 400,
            }
          );
        }

        const size =
          await prisma.size.findUnique({
            where: {
              id: sizeId,
            },
          });

        if (!size) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Size not found for variant ${sku}`,
            },
            {
              status: 404,
            }
          );
        }
      }

      // ========================================
      // VOLUME
      // ========================================

      let volumeId:
        | number
        | null = null;

      if (
        variant.volumeId !==
          null &&
        variant.volumeId !==
          undefined &&
        variant.volumeId !== ""
      ) {
        volumeId =
          Number(
            variant.volumeId
          );

        if (
          !Number.isInteger(
            volumeId
          ) ||
          volumeId <= 0
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Invalid volume for variant ${sku}`,
            },
            {
              status: 400,
            }
          );
        }

        const volume =
          await prisma.volume.findUnique({
            where: {
              id: volumeId,
            },
          });

        if (!volume) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Volume not found for variant ${sku}`,
            },
            {
              status: 404,
            }
          );
        }
      }

      // ========================================
      // CHECK SKU
      // ========================================

      const existingVariant =
        await prisma.productVariant.findUnique(
          {
            where: {
              sku,
            },
          }
        );

      if (
        existingVariant &&
        existingVariant.productId !==
          productId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `SKU already exists: ${sku}`,
          },
          {
            status: 409,
          }
        );
      }
    }

    // ==========================================
    // TRANSACTION
    // ==========================================

    const updatedProduct =
      await prisma.$transaction(
        async (tx) => {
          // ========================================
          // DELETE OLD VARIANTS
          // ========================================

          await tx.productVariant.deleteMany({
            where: {
              productId,
            },
          });

          // ========================================
          // DELETE OLD IMAGES
          // ========================================

          await tx.productImage.deleteMany({
            where: {
              productId,
            },
          });

          // ========================================
          // UPDATE PRODUCT
          // ========================================

          const product =
            await tx.product.update({
              where: {
                id: productId,
              },

              data: {
                name:
                  name.trim(),

                slug,

                brand:
                  typeof brand ===
                    "string" &&
                  brand.trim()
                    ? brand.trim()
                    : null,

                description:
                  typeof description ===
                    "string" &&
                  description.trim()
                    ? description.trim()
                    : null,

                categoryId:
                  numericCategoryId,

                productDetails:
                  cleanedProductDetails,

                careInstructions:
                  cleanedCareInstructions,

                ...(typeof isActive ===
                "boolean"
                  ? {
                      isActive,
                    }
                  : {}),

                // ==================================
                // VARIANTS
                // ==================================

                variants: {
                  create:
                    variants.map(
                      (
                        variant: any
                      ) => {
                        const price =
                          Number(
                            variant.price
                          );

                        const discountPercent =
                          Number(
                            variant.discountPercent ??
                              0
                          );

                        const calculatedSalePrice =
                          price -
                          price *
                            (discountPercent /
                              100);

                        return {
                          sku:
                            String(
                              variant.sku
                            ).trim(),

                          stockQty:
                            Number(
                              variant.stockQty ??
                                0
                            ),

                          price,

                          discountPercent,

                          salePrice:
                            Number(
                              calculatedSalePrice.toFixed(
                                2
                              )
                            ),

                          // ==================================
                          // COLOR
                          // ==================================

                          colorName:
                            variant.colorName ||
                            variant.color ||
                            null,

                          colorCode:
                            variant.colorCode ||
                            null,

                          // ==================================
                          // SIZE
                          // ==================================

                          sizeId:
                            variant.sizeId !==
                              null &&
                            variant.sizeId !==
                              undefined &&
                            variant.sizeId !==
                              ""
                              ? Number(
                                  variant.sizeId
                                )
                              : null,

                          // ==================================
                          // VOLUME
                          // ==================================

                          volumeId:
                            variant.volumeId !==
                              null &&
                            variant.volumeId !==
                              undefined &&
                            variant.volumeId !==
                              ""
                              ? Number(
                                  variant.volumeId
                                )
                              : null,
                        };
                      }
                    ),
                },

                // ==================================
                // IMAGES
                // ==================================

                images: {
                  create:
                    images.map(
                      (
                        image: any,
                        index: number
                      ) => ({
                        imageUrl:
                          String(
                            image.imageUrl ??
                              image.url ??
                              ""
                          ),

                        altText:
                          image.altText !=
                          null
                            ? String(
                                image.altText
                              )
                            : null,

                        sortOrder:
                          image.sortOrder !=
                          null
                            ? Number(
                                image.sortOrder
                              )
                            : index,

                        isHover:
                          Boolean(
                            image.isHover
                          ),
                      })
                    ),
                },
              },

              include: {
                category: true,

                variants: {
                  include: {
                    size: true,
                    volume: true,
                  },

                  orderBy: {
                    id: "asc",
                  },
                },

                images: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                },
              },
            });

          return product;
        }
      );

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully",
        data: updatedProduct,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "PUT /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}