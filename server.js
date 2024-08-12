let paymentsClient; // Define in global scope

function initializeGooglePay() {
    paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

    const googlePayButton = paymentsClient.createButton({
        buttonColor: 'black',
        buttonType: 'pay',
        onClick: onGooglePayButtonClicked
    });
    document.getElementById('google-pay-button-container').appendChild(googlePayButton);
}

async function onGooglePayButtonClicked() {


        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
                },
            }],
            merchantInfo: {
                merchantName: 'Example Merchant',
                merchantId: 'BCR2DN4TSWC73GJ5'
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