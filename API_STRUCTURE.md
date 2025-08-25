# API Structure Documentation

## Base Configuration

All APIs use the same base URL and consistent structure for easy integration.

**Base URL:** `https://backend-nest-payment-checkout.ondeploy.space/api/v1`

## API Endpoints Structure

### Products API
```
GET /product                 - List products with pagination
GET /product/:id             - Get single product by ID
```

**Query Parameters for product listing:**
- `cursor` (optional): Pagination cursor for next page
- `direction` (optional): `forward` or `backward`
- `take` (optional): Number of items per page (default: 10)

### Transactions API
```
POST /transactions           - Create new transaction
GET /transactions/:id        - Get transaction status
GET /transactions           - Get user transactions (query: customer_email)
```

### Payment Sources API (Future)
```
POST /payment-sources        - Create payment source (tokenization)
GET /payment-sources         - Get user payment sources (query: customer_email)
```

### Wompi Integration API
```
POST /wompi/transactions     - Create Wompi transaction (backend proxy)
GET /wompi/transactions/:id  - Check Wompi transaction status
POST /wompi/webhooks         - Wompi webhook handler
```

## Request/Response Examples

### Create Transaction Request
```json
{
  "amount_in_cents": 50000,
  "currency": "COP",
  "customer_email": "customer@example.com",
  "reference": "PAY_1234567890_ABC123",
  "card_info": {
    "number": "4111111111111111",
    "cvc": "123",
    "exp_month": "12",
    "exp_year": "25",
    "card_holder": "JOHN DOE"
  },
  "customer_data": {
    "email": "customer@example.com",
    "full_name": "John Doe",
    "phone_number": "+573001234567",
    "legal_id": "12345678",
    "legal_id_type": "CC"
  }
}
```

### Create Transaction Response
```json
{
  "success": true,
  "transaction": {
    "id": "txn_1234567890_abc123",
    "status": "PENDING",
    "reference": "PAY_1234567890_ABC123",
    "amount_in_cents": 50000,
    "currency": "COP",
    "customer_email": "customer@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "wompi_transaction": {
      "id": "wompi_txn_xyz789",
      "status": "PENDING",
      "payment_method": {
        "type": "CARD",
        "extra": {
          "brand": "VISA",
          "last_four": "1111",
          "card_holder": "JOHN DOE"
        }
      }
    }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Your payment was declined. Please try with a different card.",
    "details": "Additional error information"
  }
}
```

## Frontend API Services

### Structure
- **BaseApiService**: Common functionality (timeout, error handling, query building)
- **ProductsApiService**: Product-related operations
- **PaymentApiService**: Payment and transaction operations

### Key Features
- ✅ Consistent error handling
- ✅ Request timeout (30s)
- ✅ Automatic query string building
- ✅ TypeScript interfaces for all requests/responses
- ✅ Simulation mode for development

### Environment Configuration
All configuration is centralized in `src/config/environment.ts`:

```typescript
export const ENV = {
  API: {
    BASE_URL: 'https://backend-nest-payment-checkout.ondeploy.space/api/v1',
    TIMEOUT: 30000
  },
  WOMPI: {
    SANDBOX_URL: 'https://api-sandbox.co.uat.wompi.dev/v1',
    PUBLIC_KEY: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
    // ... other Wompi keys
  },
  PAYMENT: {
    POLLING_INTERVAL: 3000,    // 3 seconds
    POLLING_TIMEOUT: 120000,   // 2 minutes
  }
}
```

## Integration Steps

1. **Backend Ready**: Uncomment real API calls in `paymentApi.ts`
2. **Remove Simulation**: Delete `simulate*()` methods
3. **Environment**: Update base URL if needed
4. **Test**: All endpoints and error scenarios

The frontend is fully structured and ready for immediate backend integration with consistent API patterns.