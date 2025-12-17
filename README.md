# STK Push Integration Backend

A Node.js/Express backend for Safaricom M-Pesa STK Push integration. Supports initiating STK Push payments and receiving callbacks from Daraja API with full metadata handling.

## Table of Contents

1. Project Structure
2. Installation
3. Environment Variables
4. Available Routes
5. STK Push Flow
6. Callback Handling
7. Developer Quick Start
8. Testing with ngrok
9. Notes

## Project Structure

├── app.js # Entry point
├── package.json
├── .env.example # Template for environment variables
├── routes/
│ └── stkPushRoute.js # STK Push and callback routes
├── controllers/
│ ├── stkPushController.js # Initiates STK Push
│ └── stkCallbackController.js # Handles Daraja callback
├── utils/
│ └── mpesa.js # Utility functions: timestamp, password, token, phone normalization
└── README.md

## Installation
1. clone the repository:
```bash
git clone <url>
cd stk-push
```
2. Install dependecies:
```bash
npm install
```
3. Copy .env.example to .env and fill in your credentials:
```bash
cp .env.example .env
```
## Enviroment Variables

### Create a .env file in the project root

```bash
DARAJA_CONSUMER_KEY=your_consumer_key_here
DARAJA_CONSUMER_SECRET=your_consumer_secret_here
DARAJA_SHORTCODE=174379
DARAJA_PASSKEY=your_passkey_here
BASE_URL=https://<your-ngrok-or-production-url>
```
- BASE_URL is your ngrok URL during development or your production URL
- .env must not be committed; .env.example is for reference
