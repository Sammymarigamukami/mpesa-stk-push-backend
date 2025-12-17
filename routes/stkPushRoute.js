import express from 'express';
import { initializeStk } from '../controllers/stkPushController.js';
import { stkCallback } from '../controllers/stkCallbackController.js';

const router = express.Router();

router.post('/stkpush', initializeStk);
router.post('/callback', stkCallback);

export default router;
