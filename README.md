# EverAccess

EverAccess is a secure digital will and legacy planning platform designed to help users organize their digital assets and ensure they are safely transferred to chosen beneficiaries upon their passing.

## Overview

In the modern age, much of our value and identity is stored digitally. EverAccess provides a secure vault for:
- **Digital Assets:** Login credentials, social media accounts, and important documents.
- **Crypto Assets:** Cryptocurrency wallets and private keys with automated allocation logic.
- **Legacy Planning:** define who gets access to what through a beneficiary management system.

The platform includes a verification system where beneficiaries can request access (e.g., by providing a death certificate), which is reviewed by administrators before releasing the assets.

## Features

- **Secure Storage:** Bank-grade encryption for sensitive data.
- **Asset Management:**
  - Store login credentials, documents, and financial details.
  - Manage cryptocurrency wallets and define percentage-based allocations for beneficiaries.
- **Beneficiary Management:** Add family members or trusted individuals and assign specific assets to them.
- **Beneficiary Portal:** A dedicated interface for beneficiaries to view and claim their inheritance after verification.
- **Verification System:** Workflow for beneficiaries to submit proof of death and for admins to approve/reject claims.
- **Admin Dashboard:** specialized interface for platform administrators to manage users and verifications.

## Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (implied)
- **API Client:** Axios

### Backend
- **Framework:** FastAPI (Python)
- **Database ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)

### Infrastructure
- **Database:** MySQL
- **Containerization:** Docker & Docker Compose

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd everaccess
   ```

2. **Start the application using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This command will build the images for the backend, frontend, and database, and start the services.

3. **Access the application:**
   - **Frontend:** Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Backend API:** Open [http://localhost:8000](http://localhost:8000).
   - **API Documentation:** Interactive API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Development

- **Backend:** Located in the `backend/` directory.
  - The API runs on port `8000`.
  - Database runs on port `3306`.
- **Frontend:** Located in the `frontend/` directory.
  - Runs on port `3000`.

## Project Structure

```
/everaccess
├── backend/                 # FastAPI application
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── ...
│   └── ...
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   └── ...
│   └── ...
├── docker-compose.yml       # Docker services configuration
└── README.md                # Project documentation
```

## License

[MIT](https://choosealicense.com/licenses/mit/)