require('dotenv').config()

const http = require('http');
const port = 3000;

const requestHandler = async (request, response) => {
    switch (request.url) {
        case '/metrics':
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache'
            });

            response.write(await getBrevoAccountMetrics());
            response.end();
            break;
        default:
            response.end('<a href="/metrics">Metrics</a>');
            break;
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Error starting webserver', err);
    }

    if (!process.env.BREVO_API_KEY) {
        console.error('BREVO_API_KEY environment variable is not set');
        process.exit(1);
    }

    console.log(`Webserver is listening on http://localhost:${port}`);
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

    console.log(jsonData);

    let plans = jsonData.plan.filter((plan) => {
        return plan.creditsType == 'sendLimit';
    })

    let metric = '';
    metric += '# TYPE brevo_mail_credits gauge\n';
    metric += '# HELP brevo_mail_credits Number of credits remaining in the Brevo account\n';

    plans.forEach(plan => {
        metric += `brevo_credits{type=${plan.type}} ${plan.credits}\n`;
    });

    return metric;
}

