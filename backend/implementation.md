# Frontend Implementation Guide

This document outlines the frontend implementation details for the EverAccess application, which will be built using Next.js and TypeScript. It details the necessary pages and their interactions with the backend API.

## 1. Project Setup

- Initialize a new Next.js project with TypeScript.
- Set up a basic project structure with `pages`, `components`, `services`, `styles`, etc.
- Install necessary libraries like `axios` for API calls.

## 2. Authentication

### Pages
- `/login`: User login page.
- `/register`: User registration page.

### API Endpoints

#### User Registration
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Description:** Creates a new user account.
- **Frontend Action:** A form that collects user details and calls this endpoint. Upon successful registration, redirect the user to the login page.

#### User Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Frontend Action:** A form for users to enter their credentials. On successful login, store the received JWT token securely (e.g., in an HTTP-only cookie or local storage) and redirect the user to their dashboard.

## 3. Asset Management

### Pages
- `/dashboard/assets`: A page to display and manage all of a user's assets.
- `/dashboard/assets/new`: A form to add a new asset.
- `/dashboard/assets/[asset_id]`: A page to view details of a specific asset.

### API Endpoints

#### Create Asset
- **Method:** `POST`
- **Endpoint:** `/assets/`
- **Description:** Adds a new asset for the authenticated user.
- **Frontend Action:** A form where users can input asset details.

#### Get All Assets
- **Method:** `GET`
- **Endpoint:** `/assets/`
- **Description:** Retrieves all assets belonging to the authenticated user.
- **Frontend Action:** Display the list of assets on the `/dashboard/assets` page.

#### Get Asset by ID
- **Method:** `GET`
- **Endpoint:** `/assets/{asset_id}`
- **Description:** Fetches details of a single asset.
- **Frontend Action:** Used to display detailed information on the `/dashboard/assets/[asset_id]` page.

#### Delete Asset
- **Method:** `DELETE`
- **Endpoint:** `/assets/{asset_id}`
- **Description:** Removes an asset.
- **Frontend Action:** A button on the asset details page or asset list to delete the asset.

#### Upload File
- **Method:** `POST`
- **Endpoint:** `/assets/uploadfile/`
- **Description:** Uploads a file associated with an asset.
- **Frontend Action:** A file input in the asset creation/editing form.

## 4. Beneficiary Management

### Pages
- `/dashboard/beneficiaries`: A page to list and manage beneficiaries.
- `/dashboard/beneficiaries/new`: A form to add a new beneficiary.

### API Endpoints

#### Add Beneficiary
- **Method:** `POST`
- **Endpoint:** `/beneficiaries/`
- **Description:** Adds a new beneficiary to the user's account.
- **Frontend Action:** A form to enter beneficiary details.

#### Get All Beneficiaries
- **Method:** `GET`
- **Endpoint:** `/beneficiaries/`
- **Description:** Retrieves all beneficiaries for the user.
- **Frontend Action:** Display the list of beneficiaries on the `/dashboard/beneficiaries` page.

#### Get Beneficiary by ID
- **Method:** `GET`
- **Endpoint:** `/beneficiaries/{beneficiary_id}`
- **Description:** Gets details of a specific beneficiary.
- **Frontend Action:** Can be used to show more details in a modal or a dedicated page.

#### Delete Beneficiary
- **Method:** `DELETE`
- **Endpoint:** `/beneficiaries/{beneficiary_id}`
- **Description:** Removes a beneficiary.
- **Frontend Action:** A button to remove a beneficiary from the list.

## 5. Crypto Asset Management

### Pages
- `/dashboard/crypto`: Page to manage cryptocurrency assets and their allocations.

### API Endpoints

#### Add Crypto Asset
- **Method:** `POST`
- **Endpoint:** `/crypto/assets`
- **Description:** Adds a new cryptocurrency asset.
- **Frontend Action:** A form for adding crypto assets.

#### Get Crypto Asset
- **Method:** `GET`
- **Endpoint:** `/crypto/assets/{asset_id}`
- **Description:** Retrieves a specific crypto asset.
- **Frontend Action:** Display details of a crypto asset.

#### Add Crypto Allocation
- **Method:** `POST`
- **Endpoint:** `/crypto/assets/{asset_id}/allocations`
- **Description:** Allocates a crypto asset to a beneficiary.
- **Frontend Action:** A form to link a crypto asset to a beneficiary with a specific share.

#### Get Crypto Allocations
- **Method:** `GET`
- **Endpoint:** `/crypto/assets/{asset_id}/allocations`
- **Description:** Gets all allocations for a specific crypto asset.
- **Frontend Action:** Display how a crypto asset is distributed among beneficiaries.

#### Disburse Crypto Asset
- **Method:** `POST`
- **Endpoint:** `/crypto/assets/{asset_id}/disburse`
- **Description:** Initiates the disbursement process for a crypto asset.
- **Frontend Action:** A button to trigger the disbursement, likely used in the beneficiary portal or by an admin.

## 6. Beneficiary Portal

This section is for beneficiaries to access the assets that have been granted to them after the user's passing.

### Pages
- `/portal/login`: A login page for beneficiaries.
- `/portal/dashboard`: The main dashboard for a beneficiary.
- `/portal/assets`: View accessible assets.
- `/portal/claim`: Page to initiate the asset claim process.

### API Endpoints

#### Beneficiary Login
- A secure method for beneficiary authentication needs to be designed. This might involve a unique link sent via email or another form of verification. The current backend routes do not specify a beneficiary login endpoint, so this will need to be added.

#### Get Accessible Assets
- **Method:** `GET`
- **Endpoint:** `/beneficiary-portal/assets`
- **Description:** Fetches the general assets assigned to the authenticated beneficiary.
- **Frontend Action:** Display the list of assets on the beneficiary's dashboard.

#### Get Crypto Distributions
- **Method:** `GET`
- **Endpoint:** `/beneficiary-portal/crypto-distributions`
- **Description:** Retrieves the cryptocurrency allocations for the beneficiary.
- **Frontend Action:** Display the crypto assets the beneficiary is entitled to.

## 7. Verification Process (for Beneficiaries)

To claim assets, a beneficiary needs to upload verification documents (like a death certificate).

### API Endpoints

#### Submit Verification Request
- **Method:** `POST`
- **Endpoint:** `/verifications/requests`
- **Description:** A beneficiary submits a request to start the verification process.
- **Frontend Action:** A form where a beneficiary can initiate a claim.

#### Upload Verification Document
- **Method:** `POST`
- **Endpoint:** `/verifications/requests/{request_id}/documents`
- **Description:** Uploads a document for a verification request.
- **Frontend Action:** A file upload form for documents like a death certificate.

## 8. Admin Panel

### Pages
- `/admin/dashboard`: Main dashboard for administrators.
- `/admin/users`: View all users.
- `/admin/verifications`: Manage and review verification requests.

### API Endpoints

#### Get All Users
- **Method:** `GET`
- **Endpoint:** `/admin/users`
- **Description:** Retrieves a list of all users for administrative purposes.
- **Frontend Action:** Display a table of users in the admin panel.

#### Get User by ID
- **Method:** `GET`
- **Endpoint:** `/admin/users/{user_id}`
- **Description:** Fetches detailed information about a specific user.
- **Frontend Action:** Show detailed view of a user.

#### Get All Verification Requests
- **Method:** `GET`
- **Endpoint:** `/admin/verifications/requests`
- **Description:** Fetches all verification requests for admin review.
- **Frontend Action:** A list or queue of pending verification requests.

#### Approve Verification Request
- **Method:** `POST`
- **Endpoint:** `/admin/verifications/requests/{request_id}/approve`
- **Description:** Approves a beneficiary's verification request.
- **Frontend Action:** A button for an admin to approve a request.

#### Reject Verification Request
- **Method:** `POST`
- **Endpoint:** `/admin/verifications/requests/{request_id}/reject`
- **Description:** Rejects a beneficiary's verification request.
- **Frontend Action:** A button for an admin to reject a request, possibly with a field for the reason.
