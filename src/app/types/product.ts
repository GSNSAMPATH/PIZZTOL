export interface ProductImage {
  id: number;
  url?: string;
  imageUrl?: string;
  file?: File;
  altText?: string;
  sortOrder?: number;
  isHover?: boolean;
}

export interface ProductColor {
  id: number;
  name: string;
  code: string;
}

export interface ProductSize {
  id: number;
  name: string; // <-- Required
}

export interface ProductVolume {
  [x: string]: any;
  id: number;
  name: string;
}

export interface ProductVariant {
  color?: string;
  size?: string;
  volume?: string;

  colorName?: string;
  colorCode?: string;
  sizeId?: number | null;
  volumeId?: number | null;

  sku: string;
  stockQty: string;

  regularPrice: string;
  discountPercent: string;
  salePrice: string;

}

export interface ProductFormData {
  name: string;
  slug: string;
  brand: string;
  description: string;
  categoryId: string;
}