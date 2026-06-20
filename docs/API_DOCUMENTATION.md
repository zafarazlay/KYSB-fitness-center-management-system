# API Documentation
# KYSB Fitness Center Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

## Authentication Endpoints

### Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "phoneNumber": "03001234567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register
```
POST /auth/register
```

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "03009876543"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

### Update Current User
```
PUT /auth/me
Authorization: Bearer <token>
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "03001234567"
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 401 | Invalid email or password | Login credentials are incorrect |
| 401 | Access token is required | No token provided |
| 403 | You do not have permission | User role is not authorized |
| 404 | User not found | User does not exist |
| 409 | Email already registered | Email is already in use |

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

## API Versioning

Current API version: v1 (implicit in all endpoints)

Future versions will be explicit: `/api/v2/...`

## Pagination

For endpoints returning lists, pagination parameters:

```
GET /api/endpoint?page=1&limit=10
```

Response includes pagination info:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Coming Soon

- Member Management Endpoints
- Payment Management Endpoints
- Announcement Endpoints
- Transaction Endpoints
- Report Generation Endpoints
- Notification Endpoints
- Admin Dashboard Endpoints

Detailed documentation for each endpoint will be added as they are implemented.
