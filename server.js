const express = ('express');
const bodyParser = ('body-parser');
const cors = ('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle Google Pay transactions
app.post('/process-google-pay', async (req, res) => {
    try {
        // Log the received payment data
        console.log('Received payment data:', req.body);

        // Here, you would typically process the payment with your payment processor.
        // For example, you might use a library or SDK from Stripe, Braintree, etc.

        // Respond with success status
        res.status(200).json({ success: true, message: 'Payment processed successfully' });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Payment processing failed' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
