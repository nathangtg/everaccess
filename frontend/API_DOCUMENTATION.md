# EverAccess Backend API Documentation

This document details the available API endpoints, their capabilities, request bodies, and response bodies.

## Base URL
`http://localhost:8000` (assuming local development)

## 1. Authentication

### POST `/auth/register`
Registers a new user.

*   **Request Body:** `application/json`
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123",
      "name": "John Doe"
    }
    ```
*   **Response Body:** `application/json`
    ```json
    {
      "access_token": "jwt_token_string",
      "token_type": "bearer"
    }
    ```

### POST `/auth/login`
Authenticates a user and returns an access token.

*   **Request Body:** `application/json`
    ```json
    {
      "username": "user@example.com",
      "password": "securePassword123"
    }
    ```
    *Note: `username` field should contain the user's email.*

*   **Response Body:** `application/json`
    ```json
    {
      "access_token": "jwt_token_string",
      "token_type": "bearer"
    }
    ```

## 2. Assets

### GET `/assets/`
Retrieves a list of all assets for the authenticated user.

*   **Query Parameters:**
    *   `skip` (int, default=0): Number of records to skip.
    *   `limit` (int, default=100): Maximum number of records to return.
*   **Response Body:** `application/json` (Array of `Asset` objects)
    ```json
    [
      {
        "asset_id": "uuid-string",
        "asset_type": "login_credential",
        "platform_name": "Google",
        "asset_name": "Gmail",
        "username": "john@gmail.com",
        "password": "encrypted-password",
        "recovery_email": "recovery@example.com",
        "recovery_phone": "+15550000000",
        "notes": "My primary email",
        "category": "Personal"
      }
    ]
    ```

### POST `/assets/`
Creates a new asset.

*   **Request Body:** `application/json`
    ```json
    {
      "asset_type": "login_credential", 
      "platform_name": "Google",
      "asset_name": "Gmail",
      "username": "john@gmail.com",
      "password": "password123",
      "recovery_email": "recovery@example.com",
      "recovery_phone": "+15550000000",
      "notes": "My primary email",
      "category": "Personal"
    }
    ```
    *   `asset_type` options: `"login_credential"`, `"crypto_wallet"`, `"document"`, `"social_media"`, `"financial"`, `"other"`

*   **Response Body:** `application/json` (Created `Asset` object)

### GET `/assets/{asset_id}`
Retrieves details of a specific asset.

*   **Path Parameters:** `asset_id` (string)
*   **Response Body:** `application/json` (`Asset` object)

### DELETE `/assets/{asset_id}`
Deletes a specific asset.

*   **Path Parameters:** `asset_id` (string)
*   **Response Body:** `204 No Content`

### POST `/assets/uploadfile/`
Uploads a file (e.g., for document assets).

*   **Request Body:** `multipart/form-data`
    *   `file`: The file to upload.
*   **Response Body:** `application/json`
    ```json
    {
      "filename": "uploaded_file_name.pdf"
    }
    ```

## 3. Beneficiaries

### GET `/beneficiaries/`
Retrieves a list of beneficiaries.

*   **Query Parameters:** `skip`, `limit`
*   **Response Body:** `application/json` (Array of `Beneficiary` objects)
    ```json
    [
      {
        "beneficiary_id": "uuid-string",
        "email": "jane@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone_number": "+15551234567",
        "relationship_type": "Spouse"
      }
    ]
    ```

### POST `/beneficiaries/`
Creates a new beneficiary.

*   **Request Body:** `application/json`
    ```json
    {
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+15551234567",
      "relationship_type": "Spouse"
    }
    ```
*   **Response Body:** `application/json` (Created `Beneficiary` object)

### GET `/beneficiaries/{beneficiary_id}`
Retrieves details of a specific beneficiary.

*   **Path Parameters:** `beneficiary_id` (string)
*   **Response Body:** `application/json` (`Beneficiary` object)

### DELETE `/beneficiaries/{id}`
Deletes a specific beneficiary.

*   **Path Parameters:** `id` (string)
*   **Response Body:** `204 No Content`

## 4. Crypto Assets

### POST `/crypto/assets`
Creates a new crypto asset (wallet) and automatically links it to a generic Asset entry.

*   **Request Body:** `application/json`
    ```json
    {
      "wallet_type": "Metamask",
      "wallet_address": "0x123abc...",
      "private_key": "encrypted-private-key",
      "seed_phrase": "encrypted-seed-phrase",
      "balance_usd": 5000.00,
      "balance_crypto": 2.5
    }
    ```
*   **Response Body:** `application/json`
    ```json
    {
      "crypto_asset_id": "asset-uuid-string",
      "wallet_type": "Metamask",
      "wallet_address": "0x123abc...",
      ...
    }
    ```

### GET `/crypto/assets/{asset_id}`
Retrieves details of a specific crypto asset.

*   **Path Parameters:** `asset_id` (string)
*   **Response Body:** `application/json` (`CryptoAsset` object)

### POST `/crypto/assets/{asset_id}/allocations`
Allocates a percentage of a crypto asset to a beneficiary.

*   **Path Parameters:** `asset_id` (string)
*   **Request Body:** `application/json`
    ```json
    {
      "beneficiary_id": "beneficiary-uuid-string",
      "percentage": 50.0
    }
    ```
*   **Response Body:** `application/json` (`CryptoAllocation` object)

### GET `/crypto/assets/{asset_id}/allocations`
Retrieves all allocations for a specific crypto asset.

*   **Response Body:** `application/json` (Array of `CryptoAllocation` objects)

### POST `/crypto/assets/{asset_id}/disburse`
Triggers the mock disbursement calculation/process for a crypto asset.

*   **Response Body:** `application/json` (Result of calculation)

## 5. Verifications

### POST `/verifications/requests`
Submits a verification request (e.g., by a beneficiary claiming an account).

*   **Request Body:** `application/json`
    ```json
    {
      "requester_email": "beneficiary@example.com",
      "user_id": "deceased-user-uuid"
    }
    ```
*   **Response Body:** `application/json` (`VerificationRequest` object)

### POST `/verifications/requests/{request_id}/documents`
Uploads a supporting document for a verification request.

*   **Request Body:** `multipart/form-data` (file) + `document_type` (form field)
*   **Response Body:** `application/json` (`VerificationDocument` object)

### GET `/verifications/admin/requests`
(Admin) Retrieves all verification requests.

*   **Response Body:** `application/json` (Array of `VerificationRequest` objects)

### POST `/verifications/admin/requests/{request_id}/approve`
(Admin) Approves a verification request.

*   **Response Body:** `application/json` (Updated `VerificationRequest` object)

### POST `/verifications/admin/requests/{request_id}/reject`
(Admin) Rejects a verification request.

*   **Request Body:** `form-data` with `reason` field.
*   **Response Body:** `application/json` (Updated `VerificationRequest` object)

## 6. Beneficiary Portal

### GET `/beneficiary-portal/assets`
Retrieves assets available to the authenticated beneficiary.

*   **Response Body:** `application/json` (Array of `Asset` objects)

### GET `/beneficiary-portal/crypto-distributions`
Retrieves crypto distributions allocated to the authenticated beneficiary.

*   **Response Body:** `application/json` (Array of `CryptoAllocation` objects)

## 7. Admin

### GET `/admin/users`
Retrieves a list of all users in the system with extended admin details.

*   **Response Body:** `application/json` (Array of `UserAdminView` objects)

### GET `/admin/users/{user_id}`
Retrieves detailed information for a specific user.

*   **Response Body:** `application/json` (`UserAdminView` object)
