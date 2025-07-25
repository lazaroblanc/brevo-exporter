# brevo-exporter

Simple exporter to expose metrics from the Brevo (formerly Sendinblue) API

<img width="211" height="155" alt="image" src="https://github.com/user-attachments/assets/075740d9-94b3-4fb4-803e-4cbca64c8a13" />

## Rationale

Because I use the Brevo free tier, I have a send limit of 300 emails per day. I created this very simple Prometheus exporter because I wanted to monitor the amount of e-mails sent/credits remaining and store the usage in a TSDB.

Right now the credits remaining in the account is the only metric that's being exposed but issues/pull requests to expand the functionality are welcome.

## Usage

If not already present: Generate an API key -> https://app.brevo.com/settings/keys/api

### Docker CLI

```
docker run -e BREVO_API_KEY='your-brevo-api-key' -p 3000:3000 ghcr.io/lazaroblanc/brevo-exporter:latest
```

### docker-compose

```yaml
services:
  server:
    image: ghcr.io/lazaroblanc/brevo-exporter:latest
    environment:
      BREVO_API_KEY: 'your-brevo-api-key'
    ports:
      - 9587:3000
```

### Prometheus config

```yaml
- job_name: "brevo"
  scrape_interval: 5m
  static_configs:
    - targets:
        - localhost:9587 # brevo-exporter
```

## Metrics

| Name          | Description                                               |
|---------------|-----------------------------------------------------------|
| brevo_credits | Number of credits remaining in the Brevo account per plan |
