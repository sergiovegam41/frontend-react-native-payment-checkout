import { ProductsResponse, ProductsApiParams, Product } from '../types/api';
import { BaseApiService, API_CONFIG } from './apiConfig';

class ProductsApiService extends BaseApiService {
  /**
   * Get products with pagination - using new backend API
   */
  async getProducts(params?: ProductsApiParams): Promise<ProductsResponse> {
    const queryParams = {
      cursor: params?.cursor,
      direction: params?.direction,
      take: params?.take || 10,
    };

    const queryString = this.buildQueryString(queryParams);

    try {
      // Call the new backend endpoint directly
      const url = `https://backend-nest-payment-checkout.ondeploy.space/api/v1/product${queryString}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the response to match our expected structure
      const transformedData: ProductsResponse = {
        data: data.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price, // Now it's a number (cents)
          stock: product.stock,
          rating: product.rating || 0, // Use actual rating from API
          mainImageUrl: product.mainImageUrl,
          images: [{
            url: product.mainImageUrl,
            altText: product.name,
            position: 0,
            isMain: true
          }]
        })),
        pagination: data.pagination
      };
      
      return transformedData;
    } catch (error) {
      console.error('Products API error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID - using new backend API
   */
  async getProductById(productId: string): Promise<Product> {
    try {
      const url = `https://backend-nest-payment-checkout.ondeploy.space/api/v1/product/${productId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const product = await response.json();
      
      // Transform the response to match our expected structure
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price, // Now it's a number (cents)
        stock: product.stock,
        rating: product.rating || 0, // Use actual rating from API
        images: product.images || [{
          url: product.mainImageUrl || 'https://picsum.photos/640/480/',
          altText: product.name,
          position: 0,
          isMain: true
        }]
      };
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }
}

export const productsApi = new ProductsApiService();