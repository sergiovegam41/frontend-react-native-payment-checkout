export interface ProductImage {
  url: string;
  altText: string;
  position: number;
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number; // Rating from 0-5
  images: ProductImage[];
  mainImageUrl?: string;
}

// For backward compatibility during transition
export interface LegacyProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface PaginationInfo {
  hasNext: boolean;
  nextCursor: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export interface ProductsApiParams {
  cursor?: string;
  direction?: 'forward' | 'backward';
  take?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}