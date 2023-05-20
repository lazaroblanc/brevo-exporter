# brevo-exporter

Simple exporter to expose metrics from the Brevo (formerly Sendinblue) API

## Rationale

Because I use the Brevo free tier, I have a send limit of 300 emails per day. I created this very simple Prometheus exporter because I wanted to monitor the amount of e-mails sent/credits remaining and store the usage in a TSDB.

Right now the credits remaining in the account is the only metric that's being exposed but issues/pull requests to expand the functionality are welcome.

## Usage

If not already present: Generate an API key -> https://app.brevo.com/settings/keys/api

### Docker CLI

```
docker run -e BREVO_API_KEY='your-brevo-api-key' -p 3000:3000 lazaroblanc/brevo-exporter:latest
```

### docker-compose

```yaml
services:
  server:
    image: lazaroblanc/brevo-exporter:latest
    environment:
      BREVO_API_KEY: 'your-brevo-api-key'
    ports:
      - 3000:3000
```