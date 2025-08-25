import { ProductsResponse, ProductsApiParams } from '../types/api';
import { BaseApiService, API_CONFIG } from './apiConfig';

class ProductsApiService extends BaseApiService {
  /**
   * Get products with pagination
   */
  async getProducts(params?: ProductsApiParams): Promise<ProductsResponse> {
    const queryParams = {
      cursor: params?.cursor,
      direction: params?.direction,
      take: params?.take || 10,
    };

    const queryString = this.buildQueryString(queryParams);
    const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS}${queryString}`;

    try {
      return await this.makeRequest<ProductsResponse>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Products API error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID (for future use)
   */
  async getProductById(productId: string): Promise<any> {
    try {
      return await this.makeRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }
}

export const productsApi = new ProductsApiService();