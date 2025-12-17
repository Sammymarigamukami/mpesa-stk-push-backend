import 'dotenv/config';
import fetch from 'node-fetch';
import {
  buildStkPassword,
  darajaBase,
  getAccessToken,
  mpesaTimeStamp,
  normalizePhoneNumber
} from '../utils/mpesa.js';

export async function initializeStk(req, res) {
  try {
    const { phone, amount } = req.body;

    console.log('STK request body:', req.body);

    // Validate required fields
    if (!phone || !amount ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = 'order-' + Date.now();
    const timestamp = mpesaTimeStamp();
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;

    if (!shortcode || !passkey) {
      return res.status(500).json({ error: 'Missing Daraja credentials in .env' });
    }

    const password = buildStkPassword(shortcode, passkey, timestamp);
    const token = await getAccessToken();

    // Make STK push request
    const stkResponse = await fetch(`${darajaBase}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: normalizePhoneNumber(phone),
        PartyB: shortcode,
        PhoneNumber: normalizePhoneNumber(phone),
        CallBackURL: `${process.env.BASE_URL}/api/stkpush/callback`,
        AccountReference: `Order ${orderId}`,
        TransactionDesc: 'Payment'
      })
    });

    const data = await stkResponse.json();

    if (!stkResponse.ok) {
      console.error('Daraja error:', data);
      return res.status(500).json({ error: 'Failed to initiate STK Push', details: data });
    }

    // Success response
    return res.status(200).json({ message: 'STK Push initiated', data });

  } catch (error) {
    console.error('STK Controller Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
