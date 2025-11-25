# Frontend Implementation Guide

This document outlines the frontend implementation details for the EverAccess application, which will be built using Next.js and TypeScript. It details the necessary pages, their interactions with the backend API, and the specific data structures required.

## Project Overview & Context

**EverAccess** is a digital will service designed to organize and store users' digital assets (images, crypto, passwords, accounts) safely and ensure they are accessible to chosen beneficiaries upon the user's death.

**Key Features:**
*   **Secure Asset Storage:** Bank-grade security for storing accounts and passwords.
*   **Beneficiary Management:** Users define who gets access to what.
*   **Legacy Planning:** Simple interface to manage digital legacy.
*   **Beneficiary Portal:** A dedicated view for beneficiaries to claim and view assigned assets after verification.

**Target Audience:**
*   Users planning their digital estate.
*   Beneficiaries claiming assets.
*   Admins managing the verification and platform.

## 1. Project Setup

-   Initialize a new Next.js project with TypeScript.
-   Set up a basic project structure with `pages`, `components`, `services`, `styles`, etc.
-   Install `axios` for API calls.
-   **Base URL:** Assume `http://localhost:8000` (or your local backend port).

## 2. Authentication

**Note:** All protected endpoints require the `Authorization` header: `Bearer <access_token>`.

### Pages
-   `/login`: User login page.
-   `/register`: User registration page.

### API Endpoints

#### User Registration
-   **Method:** `POST`
-   **Endpoint:** `/auth/register`
-   **Description:** Creates a new user account.
-   **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",       // Required
      "password": "securepassword",      // Required
      "first_name": "John",              // Optional
      "last_name": "Doe"                 // Optional
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "user_id": "uuid-string",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
    ```

#### User Login
-   **Method:** `POST`
-   **Endpoint:** `/auth/login`
-   **Description:** Authenticates a user and returns a JWT token.
-   **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",   // Required
      "password": "securepassword"   // Required
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "access_token": "eyJhbGci...",
      "token_type": "bearer"
    }
    ```
-   **Frontend Action:** Store `access_token` securely (HTTP-only cookie or localStorage).

## 3. Asset Management

### Pages
-   `/dashboard/assets`: Display list of assets.
-   `/dashboard/assets/new`: Form to add asset.
-   `/dashboard/assets/[asset_id]`: View/Edit asset details.

### API Endpoints

#### Create Asset
-   **Method:** `POST`
-   **Endpoint:** `/assets/`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (JSON):**
    ```json
    {
      "asset_type": "login_credential", // Enum: 'login_credential', 'crypto_wallet', 'document', 'social_media', 'financial', 'other'
      "asset_name": "My Gmail",         // Required
      "platform_name": "Google",        // Optional
      "username": "john.doe",           // Optional
      "password": "secretpassword",     // Optional
      "recovery_email": "rec@test.com", // Optional
      "recovery_phone": "+1234567890",  // Optional
      "notes": "Main email",            // Optional
      "category": "Personal"            // Optional
    }
    ```
-   **Response (200 OK):** Returns the created `Asset` object (see *Get All Assets* for structure).

#### Get All Assets
-   **Method:** `GET`
-   **Endpoint:** `/assets/?skip=0&limit=100`
-   **Header:** `Authorization: Bearer <token>`
-   **Response (200 OK):**
    ```json
    [
      {
        "asset_id": "uuid-string",
        "asset_type": "login_credential",
        "asset_name": "My Gmail",
        "platform_name": "Google",
        "username": "john.doe",
        "password": "secretpassword",
        "recovery_email": "rec@test.com",
        "recovery_phone": "+1234567890",
        "notes": "Main email",
        "category": "Personal"
      }
    ]
    ```

#### Get Asset by ID
-   **Method:** `GET`
-   **Endpoint:** `/assets/{asset_id}`
-   **Header:** `Authorization: Bearer <token>`
-   **Response (200 OK):** Single `Asset` object.

#### Delete Asset
-   **Method:** `DELETE`
-   **Endpoint:** `/assets/{asset_id}`
-   **Header:** `Authorization: Bearer <token>`
-   **Response (200 OK):** The deleted `Asset` object.

#### Upload File
-   **Method:** `POST`
-   **Endpoint:** `/assets/uploadfile/`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (Multipart/Form-Data):**
    *   `file`: (Binary file data)
-   **Response:**
    ```json
    {
      "filename": "uploaded_file.pdf"
    }
    ```

## 4. Beneficiary Management

### Pages
-   `/dashboard/beneficiaries`: List beneficiaries.
-   `/dashboard/beneficiaries/new`: Add beneficiary.

### API Endpoints

#### Add Beneficiary
-   **Method:** `POST`
-   **Endpoint:** `/beneficiaries/`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (JSON):**
    ```json
    {
      "email": "son@example.com",    // Required
      "first_name": "Junior",        // Optional
      "last_name": "Doe",            // Optional
      "phone_number": "+1987654321", // Optional
      "relationship_type": "Child"   // Optional
    }
    ```
-   **Response (200 OK):** Returns the created `Beneficiary` object.

#### Get All Beneficiaries
-   **Method:** `GET`
-   **Endpoint:** `/beneficiaries/?skip=0&limit=100`
-   **Header:** `Authorization: Bearer <token>`
-   **Response (200 OK):**
    ```json
    [
      {
        "beneficiary_id": "uuid-string",
        "email": "son@example.com",
        "first_name": "Junior",
        "last_name": "Doe",
        "phone_number": "+1987654321",
        "relationship_type": "Child"
      }
    ]
    ```

#### Delete Beneficiary
-   **Method:** `DELETE`
-   **Endpoint:** `/beneficiaries/{beneficiary_id}`
-   **Header:** `Authorization: Bearer <token>`

## 5. Crypto Asset Management

### Pages
-   `/dashboard/crypto`: Manage crypto assets and allocations.

### API Endpoints

#### Add Crypto Asset
-   **Method:** `POST`
-   **Endpoint:** `/crypto/assets`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (JSON):**
    ```json
    {
      "wallet_type": "Metamask",       // Required
      "wallet_address": "0x123...",    // Required
      "private_key": "encrypted_key",  // Required
      "seed_phrase": "word1 word2...", // Required
      "balance_usd": 1500.50,          // Required (Decimal)
      "balance_crypto": 0.5            // Required (Decimal)
    }
    ```

#### Add Crypto Allocation
-   **Method:** `POST`
-   **Endpoint:** `/crypto/assets/{asset_id}/allocations`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (JSON):**
    ```json
    {
      "beneficiary_id": "uuid-of-beneficiary", // Required
      "percentage": 50.0                       // Required (Decimal 0-100)
    }
    ```

#### Get Crypto Allocations
-   **Method:** `GET`
-   **Endpoint:** `/crypto/assets/{asset_id}/allocations`
-   **Header:** `Authorization: Bearer <token>`
-   **Response (200 OK):**
    ```json
    [
      {
        "allocation_id": "uuid",
        "crypto_asset_id": "uuid",
        "beneficiary_id": "uuid",
        "percentage": 50.0,
        "allocated_amount_usd": 750.25,
        "allocated_amount_crypto": 0.25,
        "disbursement_status": "pending",
        "mock_transaction_id": "tx_123"
      }
    ]
    ```

#### Disburse Crypto Asset
-   **Method:** `POST`
-   **Endpoint:** `/crypto/assets/{asset_id}/disburse`
-   **Header:** `Authorization: Bearer <token>`

## 6. Beneficiary Portal

**Context:** This area is for beneficiaries to view what has been left to them *after* the user passes away.

### Pages
-   `/portal/dashboard`: Overview.
-   `/portal/assets`: List of accessible assets.
-   `/portal/claim`: Initiate verification.

### API Endpoints

#### Get Accessible Assets
-   **Method:** `GET`
-   **Endpoint:** `/beneficiary-portal/assets`
-   **Header:** `Authorization: Bearer <token>` (Beneficiary Token)
-   **Response:** List of `Asset` objects.

#### Get Crypto Distributions
-   **Method:** `GET`
-   **Endpoint:** `/beneficiary-portal/crypto-distributions`
-   **Header:** `Authorization: Bearer <token>`
-   **Response:** List of `CryptoAllocation` objects.

## 7. Verification Process

**Context:** To access assets, a beneficiary must prove the user's death (e.g., upload a death certificate).

### API Endpoints

#### Submit Verification Request
-   **Method:** `POST`
-   **Endpoint:** `/verifications/requests`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (JSON):**
    ```json
    {
      "requester_email": "beneficiary@example.com", // Required
      "user_id": "uuid-of-deceased-user"            // Required
    }
    ```
-   **Response:**
    ```json
    {
      "request_id": "uuid",
      "status": "pending", // pending, under_review, approved, rejected
      ...
    }
    ```

#### Upload Verification Document
-   **Method:** `POST`
-   **Endpoint:** `/verifications/requests/{request_id}/documents`
-   **Header:** `Authorization: Bearer <token>`
-   **Request Body (Form Data):**
    *   `file`: (Binary file)
    *   `document_type`: (String, e.g., "Death Certificate")

## 8. Admin Panel

### Pages
-   `/admin/dashboard`: Overview.
-   `/admin/users`: User management.
-   `/admin/verifications`: Review claims.

### API Endpoints

#### Get All Users
-   **Method:** `GET`
-   **Endpoint:** `/admin/users?skip=0&limit=100`
-   **Header:** `Authorization: Bearer <admin_token>`
-   **Response:** List of `UserAdminView` (includes metadata like `created_at`, `status`).

#### Verification Actions
-   **Approve:** `POST /verifications/admin/requests/{request_id}/approve`
-   **Reject:** `POST /verifications/admin/requests/{request_id}/reject` (Form Data: `reason`)
-   **List Requests:** `GET /verifications/admin/requests`