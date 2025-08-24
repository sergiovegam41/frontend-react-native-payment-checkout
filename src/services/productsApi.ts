import { ProductsResponse, ProductsApiParams } from '../types/api';

const API_BASE_URL = 'https://backend-nest-payment-checkout.ondeploy.space/api/v1';

class ProductsApiService {
  async getProducts(params?: ProductsApiParams): Promise<ProductsResponse> {
    const urlParams = new URLSearchParams();
    
    if (params?.cursor) {
      urlParams.append('cursor', params.cursor);
    }
    
    if (params?.direction) {
      urlParams.append('direction', params.direction);
    }
    
    if (params?.take) {
      urlParams.append('take', params.take.toString());
    }

    const url = `${API_BASE_URL}/product?${urlParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Products API error:', error);
      throw error;
    }
  }
}

export const productsApi = new ProductsApiService();