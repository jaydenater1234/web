const express = require('express');
const stripe = require('stripe')('your-stripe-secret-key');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server running on port 4242'));