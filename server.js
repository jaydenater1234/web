async function onGooglePayButtonClicked() {
    if (!paymentsClient) {
        console.error('PaymentsClient is not initialized.');
        return;
    }

    try {
        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: 'stripe', // Change to your payment gateway
                        gatewayMerchantId: 'BCR2DN4T2XXODA3Y' // Change to your gateway merchant ID
                    }
                }
            }],
            merchantInfo: {
                merchantName: 'J.L.R',
                merchantId: 'BCR2DN4TSWC73GJ5' // Your Google Pay merchant ID
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: '10.00',
                currencyCode: 'USD'
            }
        };

        const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
        console.log('Payment data received:', paymentData);

        const response = await fetch('http://localhost:3000/process-google-pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            console.log('Payment successful');
        } else {
            console.error('Payment failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during Google Pay transaction:', error);
    }
}
