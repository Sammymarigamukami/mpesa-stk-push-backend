import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import stkPushRoutes from './routes/stkPushRoute.js';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stkpush', stkPushRoutes);
app.use('/api/stkpush/callback', stkPushRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

