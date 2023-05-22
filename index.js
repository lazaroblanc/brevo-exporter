require('dotenv').config()

const express = require('express');
const http = require('http');
const app = express();
const port = 3000;

app.get('/metrics', async (req, res) => {
    let metrics = '';
    metrics += await getBrevoAccountMetrics();

    res.contentType('text/plain');
    res.header('Cache-Control', 'no-cache');
    res.send(metrics);
});

app.listen(port, () => {
    // terminate the server if environment variable BREVO_API_KEY is not set
    if (!process.env.BREVO_API_KEY) {
        console.error('BREVO_API_KEY environment variable is not set');
        process.exit(1);
    }

    console.log(`Listening at http://localhost:${port}`);
});

async function getBrevoAccountMetrics() {
    const response = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'api-key': process.env.BREVO_API_KEY
        }
    });
    const jsonData = await response.json();

    let plan = jsonData.plan.find((plan) => {
        return plan.type === 'free' && plan.creditsType == 'sendLimit';
    })

    let metric = '';
    metric += '# TYPE brevo_mail_credits gauge\n';
    metric += '# HELP brevo_mail_credits Number of credits remaining in the Brevo account\n';
    metric += 'brevo_mail_credits{} ' + plan.credits + '\n';

    return metric;
}

