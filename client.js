// Initialize Google Pay client
let paymentsClient;

function initializeGooglePay() {
    paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

    const googlePayButton = paymentsClient.createButton({
        buttonColor: 'black',
        buttonType: 'pay',
        onClick: onGooglePayButtonClicked
    });
    document.getElementById('google-pay-button-container').appendChild(googlePayButton);
}

// Handle Google Pay button click
async function onGooglePayButtonClicked() {
    try {
        if (!paymentsClient) {
            console.error('PaymentsClient is not initialized.');
            return;
        }

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
                        gateway: 'cardconnect', // e.g., 'stripe', 'payeezy'
                        gatewayMerchantId: '496082673999' // Merchant ID for your gateway
                    }
                }
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

        // Send payment data to your server
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

// Handle adding expenses
const expenses = [];
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountElement = document.getElementById('total-amount');

document.getElementById('add-btn').addEventListener('click', () => {
    const category = document.getElementById('category-select').value;
    const amount = parseFloat(document.getElementById('amount-input').value);
    const date = document.getElementById('date-input').value;

    if (category && !isNaN(amount) && date) {
        const expense = { category, amount, date };
        expenses.push(expense);
        updateExpenseTable();
        updatePieChart();
    }
});

function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    let totalAmount = 0;

    expenses.forEach((expense, index) => {
        totalAmount += expense.amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseTable();
    updatePieChart();
}

// Initialize Chart.js
const ctx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const dataLabel = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        return `${dataLabel}: $${value.toFixed(2)}`;
                    }
                }
            }
        }
    }
});

function updatePieChart() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    pieChart.data.labels = Object.keys(categoryTotals);
    pieChart.data.datasets[0].data = Object.values(categoryTotals);
    pieChart.update();
}

// Initialize Google Pay Button
window.onload = initializeGooglePay;
