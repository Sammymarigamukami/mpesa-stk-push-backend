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
```
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
```

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
3. Copy `.env.example` to `.env` and fill in your credentials:
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
- `.env` must not be committed; .env.example is for reference

## API Endpoints

| Method | Endpoint                | Description                           | Payload / Notes                            |
| ------ | ----------------------- | ------------------------------------- | ------------------------------------------ |
| POST   | `/api/stkpush/stkpush`  | Initiates an STK Push request         | `{ "phone": "0712345678", "amount": 100 }` |
| POST   | `/api/stkpush/callback` | Handles Daraja STK Push callback      | Automatically sent by Safaricom Daraja     |

## STK Push Flow
1. Frontend sends request to `/stkpush` with `phone` and `amount`.
2. Backend:
   - Generate timestamp and STK password.
   - Retrive access token from daraja.
   - call Daraja `/processrequest` to initiate STK Push.
   - Returns immediate response:

```json
{
  "MerchantRequestID": "12345-67890",
  "CheckoutRequestID": "ws_CO_1234567890",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```
Payment is **not yet complete**; the user must enter their PIN on their phone.

## Callback Handling
- Daraja calls `/callback` after payment completion or cancellation.
- Callback JSON structure

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "12345-67890",
      "CheckoutRequestID": "ws_CO_1234567890",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 100 },
          { "Name": "MpesaReceiptNumber", "Value": "ABCDE12345" },
          { "Name": "TransactionDate", "Value": 20251217123456 },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      },
      "MerchantMetadata": {
        "orderId": "order-1700000000000",
        "items": ["herb1","herb2"]
      }
    }
  }
}
```
- Backend must respond with:

```json
{ "ResultCode": 0, "ResultDesc": "Accepted" }
```
- You can process `CallbackMetadata` and `MerchantMetadata` to update orders or log transactions.

## Developer Quick Start
1. Clone & Install
```bash
git clone <repo_url>
cd stk-push
npm install
```
2. Setup `.env`
```bash
cp .env.example .env
```
- Fill in real credentials and `BASE_URL`.
3. Start server
```bash
node app.js
```
- Runs on `http://localhost:3000`.
4. Test STK Push
```json
POST http://localhost:3000/api/stkpush/stkpush
Content-Type: application/json

{
  "phone": "0712345678",
  "amount": 100
}
```
5. Test Callback
- Use ngrok:
```bash
ngrok http 3000
```
- Set `BASE_URL` in `.env` to your ngrok HTTPS URL.
- Complete STK Push on the test phone; callback hits `/api/stkpush/callback`.
6. Logs & Debugging
- STK request logs
```javascript
console.log('STK request body:', req.body);
```
- Callback logs
```javascript
console.log('STK Callback received:', req.body);
```

## Testing with ngrok
1. Install ngrok:
```bash
npm install -g ngrok
```
2. Start ngrok tunnel:
```bash
ngrok http 3000
```
3. Copy the HTTPS forwarding URL into `.env` as `BASE_URL`
4. STK Push and callbacks will now work locally.


