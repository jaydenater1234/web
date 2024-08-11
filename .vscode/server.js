var stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Replace with your secret key

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
