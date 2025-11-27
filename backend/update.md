# Frontend-Backend Integration Update Guide

This document outlines the routes, API endpoints, and data schemas currently implemented in the Frontend. The Backend team should ensure the API matches these specifications to enable full functionality.

## 1. Authentication (To Be Implemented)

The frontend currently mocks authentication. Please implement the following endpoints to replace the mocks.

### POST /register
**Used in:** `src/app/register/page.tsx`

*   **Payload:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
*   **Expected Response:**
    ```json
    {
      "access_token": "jwt.token.here",
      "token_type": "bearer"
    }
    ```

### POST /login
**Used in:** `src/app/login/page.tsx`

*   **Payload:**
    ```json
    {
      "username": "john@example.com", 
      "password": "securepassword123"
    }
    ```
    *(Note: Frontend sends `email` as the identifier. Ensure backend accepts email or maps it to username, standard OAuth2 often uses `username` field for email)*

*   **Expected Response:**
    ```json
    {
      "access_token": "jwt.token.here",
      "token_type": "bearer"
    }
    ```

## 2. Digital Assets

### GET /assets/
**Used in:** `src/app/dashboard/assets/page.tsx` & `src/app/dashboard/crypto/page.tsx`

*   **Query Parameters:** `?skip=0&limit=100`
*   **Expected Response:** Array of `Asset` objects.
    ```json
    [
      {
        "asset_id": "uuid-string",
        "asset_type": "login_credential", // Enum: 'login_credential', 'crypto_wallet', 'document', etc.
        "asset_name": "Gmail",
        "platform_name": "Google",
        "username": "john@gmail.com",
        "category": "Personal"
        // ... other optional fields
      }
    ]
    ```

### POST /assets/
**Used in:** `src/app/dashboard/assets/new/page.tsx`

*   **Payload:**
    ```json
    {
      "asset_type": "login_credential",
      "asset_name": "Chase Bank",
      "platform_name": "Chase",
      "username": "user123",
      "password": "password123",
      "recovery_email": "backup@email.com",
      "recovery_phone": "555-0199",
      "notes": "Main checking account",
      "category": "Finance"
    }
    ```

### DELETE /assets/{asset_id}
**Used in:** `src/app/dashboard/assets/page.tsx`

*   **Path Parameter:** `asset_id` (UUID)
*   **Expected Response:** 200 OK / 204 No Content

## 3. Beneficiaries

### GET /beneficiaries/
**Used in:** `src/app/dashboard/beneficiaries/page.tsx`

*   **Query Parameters:** `?skip=0&limit=100`
*   **Expected Response:** Array of `Beneficiary` objects.
    ```json
    [
      {
        "beneficiary_id": "uuid-string",
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "relationship_type": "Spouse",
        "phone_number": "123-456-7890"
      }
    ]
    ```

### POST /beneficiaries/
**Used in:** `src/app/dashboard/beneficiaries/new/page.tsx`

*   **Payload:**
    ```json
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@example.com",
      "phone_number": "123-456-7890",
      "relationship_type": "Spouse"
    }
    ```

### DELETE /beneficiaries/{id}
**Used in:** `src/app/dashboard/beneficiaries/page.tsx`

*   **Path Parameter:** `id` (UUID)
*   **Expected Response:** 200 OK / 204 No Content

## 4. Crypto Assets

### POST /crypto/assets
**Used in:** `src/app/dashboard/crypto/new/page.tsx`

*   **Payload:**
    ```json
    {
      "wallet_type": "Metamask",
      "wallet_address": "0x123...",
      "private_key": "encrypted-key-string",
      "seed_phrase": "twelve word seed phrase...",
      "balance_crypto": 1.5,
      "balance_usd": 3000.00
    }
    ```

### Note on Crypto Listing
Currently, `src/app/dashboard/crypto/page.tsx` fetches data from **`GET /assets/`**.
*   **Action Required:** Ensure that the `GET /assets/` endpoint returns crypto assets OR update the frontend to fetch from a dedicated `GET /crypto/assets` endpoint if the data structures differ significantly (e.g., if `CryptoAsset` is a distinct entity from `Asset`).
