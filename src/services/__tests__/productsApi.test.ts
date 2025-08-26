import { productsApi } from '../productsApi';
import { ProductsResponse, Product } from '../../types/api';

// Mock fetch
global.fetch = jest.fn();

describe('ProductsApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    const mockApiResponse = {
      data: [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Test description 1',
          price: 50000, // Price in cents
          stock: 10,
          rating: 4.5,
          mainImageUrl: 'https://example.com/image1.jpg'
        },
        {
          id: '2',
          name: 'Test Product 2',
          description: 'Test description 2',
          price: 75000,
          stock: 5,
          rating: 3.8,
          mainImageUrl: 'https://example.com/image2.jpg'
        }
      ],
      pagination: {
        hasMore: true,
        cursor: 'next-cursor',
        total: 100
      }
    };

    it('should fetch products successfully with default parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockApiResponse)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProducts();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://payment-checkout-backend.ondeploy.space/api/v1/product?take=10',
        {
          method: 'GET',
          headers: {
            'Accept': '*/*'
          }
        }
      );

      expect(result).toEqual({
        data: [
          {
            id: '1',
            name: 'Test Product 1',
            description: 'Test description 1',
            price: 50000,
            stock: 10,
            rating: 4.5,
            mainImageUrl: 'https://example.com/image1.jpg',
            images: [{
              url: 'https://example.com/image1.jpg',
              altText: 'Test Product 1',
              position: 0,
              isMain: true
            }]
          },
          {
            id: '2',
            name: 'Test Product 2',
            description: 'Test description 2',
            price: 75000,
            stock: 5,
            rating: 3.8,
            mainImageUrl: 'https://example.com/image2.jpg',
            images: [{
              url: 'https://example.com/image2.jpg',
              altText: 'Test Product 2',
              position: 0,
              isMain: true
            }]
          }
        ],
        pagination: {
          hasMore: true,
          cursor: 'next-cursor',
          total: 100
        }
      });
    });

    it('should fetch products with custom parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockApiResponse)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const params = {
        cursor: 'test-cursor',
        direction: 'forward' as const,
        take: 5
      };

      await productsApi.getProducts(params);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://payment-checkout-backend.ondeploy.space/api/v1/product?cursor=test-cursor&direction=forward&take=5',
        {
          method: 'GET',
          headers: {
            'Accept': '*/*'
          }
        }
      );
    });

    it('should handle products with missing rating', async () => {
      const mockResponseWithoutRating = {
        data: [
          {
            id: '1',
            name: 'Test Product',
            description: 'Test description',
            price: 50000,
            stock: 10,
            mainImageUrl: 'https://example.com/image.jpg'
            // rating is missing
          }
        ],
        pagination: { hasMore: false }
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponseWithoutRating)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProducts();

      expect(result.data[0].rating).toBe(0);
    });

    it('should handle HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(productsApi.getProducts()).rejects.toThrow(
        'HTTP 500: Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(productsApi.getProducts()).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(productsApi.getProducts()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getProductById', () => {
    const mockProduct = {
      id: '123',
      name: 'Single Test Product',
      description: 'Single product description',
      price: 60000,
      stock: 15,
      rating: 4.2,
      images: [
        {
          url: 'https://example.com/image1.jpg',
          altText: 'Product image 1',
          position: 0,
          isMain: true
        },
        {
          url: 'https://example.com/image2.jpg',
          altText: 'Product image 2',
          position: 1,
          isMain: false
        }
      ]
    };

    it('should fetch single product successfully', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockProduct)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProductById('123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://payment-checkout-backend.ondeploy.space/api/v1/product/123',
        {
          method: 'GET',
          headers: {
            'Accept': '*/*'
          }
        }
      );

      expect(result).toEqual({
        id: '123',
        name: 'Single Test Product',
        description: 'Single product description',
        price: 60000,
        stock: 15,
        rating: 4.2,
        images: [
          {
            url: 'https://example.com/image1.jpg',
            altText: 'Product image 1',
            position: 0,
            isMain: true
          },
          {
            url: 'https://example.com/image2.jpg',
            altText: 'Product image 2',
            position: 1,
            isMain: false
          }
        ]
      });
    });

    it('should handle product without images', async () => {
      const productWithoutImages = {
        id: '456',
        name: 'Product Without Images',
        description: 'No images product',
        price: 30000,
        stock: 8,
        rating: 3.5,
        mainImageUrl: 'https://example.com/fallback.jpg'
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(productWithoutImages)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProductById('456');

      expect(result.images).toEqual([{
        url: 'https://example.com/fallback.jpg',
        altText: 'Product Without Images',
        position: 0,
        isMain: true
      }]);
    });

    it('should handle product without mainImageUrl', async () => {
      const productWithoutMainImage = {
        id: '789',
        name: 'Product Without Main Image',
        description: 'No main image product',
        price: 40000,
        stock: 12,
        rating: 4.0
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(productWithoutMainImage)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProductById('789');

      expect(result.images).toEqual([{
        url: 'https://picsum.photos/640/480/',
        altText: 'Product Without Main Image',
        position: 0,
        isMain: true
      }]);
    });

    it('should handle product without rating', async () => {
      const productWithoutRating = {
        id: '999',
        name: 'Product Without Rating',
        description: 'No rating product',
        price: 25000,
        stock: 6,
        mainImageUrl: 'https://example.com/image.jpg'
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(productWithoutRating)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productsApi.getProductById('999');

      expect(result.rating).toBe(0);
    });

    it('should handle HTTP 404 error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(productsApi.getProductById('nonexistent')).rejects.toThrow(
        'HTTP 404: Not Found'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Connection refused'));

      await expect(productsApi.getProductById('123')).rejects.toThrow('Connection refused');
    });
  });
});