import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// Base URL for Safaricom Daraja API development environment
export const darajaBase = 'https://sandbox.safaricom.co.ke';

/**
 * Generate timestamp in format YYYYMMDDHHMMSS
 */
export function mpesaTimeStamp() {
  const currentDate = new Date();
  return (
    currentDate.getFullYear().toString() +
    String(currentDate.getMonth() + 1).padStart(2, '0') +
    String(currentDate.getDate()).padStart(2, '0') +
    String(currentDate.getHours()).padStart(2, '0') +
    String(currentDate.getMinutes()).padStart(2, '0') +
    String(currentDate.getSeconds()).padStart(2, '0')
  );
}

/**
 * Build STK Push password
 */
export function buildStkPassword(shortcode, passkey, timestamp) {
  return Buffer.from(shortcode + passkey + timestamp).toString('base64');
}

/**
 * Normalize phone number to 2547XXXXXXXX
 */
export function normalizePhoneNumber(phoneNumber) {
  let normalizedNumber = phoneNumber.trim();

  if (normalizedNumber.startsWith('0')) {
    normalizedNumber = '254' + normalizedNumber.substring(1);
  }

  if (normalizedNumber.startsWith('+')) {
    normalizedNumber = normalizedNumber.substring(1);
  }

  return normalizedNumber;
}

/**
 * Get OAuth access token from Daraja
 */
export async function getAccessToken() {
  const res = await fetch(
    `${darajaBase}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
          ).toString('base64'),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch access token');
  }

  const data = await res.json();
  return data.access_token;
}
