export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  position: number;
  isMain: boolean;
  createdAt: string;
  productId: string;
}

export interface Product {
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
  direction?: 'next' | 'prev';
  take?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}