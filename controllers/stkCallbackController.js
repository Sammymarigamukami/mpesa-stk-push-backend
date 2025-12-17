

export async function stkCallback(req, res) {
    try {
        const body = await req.body;
        console.log('STK Callback received:', body);

        const result = body.Body.stkCallback;

        if (!result) {
            return res.status(400).json({ error: 'Invalid callback data' });
        }
        const checkoutRequestId = result.CheckoutRequestID;
        const responseCode = result.ResponseCode;
        const responseDescription = result.ResponseDescription;

        // Now you can do whatever processing you need with the callback data 

    } catch (error) {
        console.error('Error handling STK Callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}