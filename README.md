# Email Service

A Node.js project that provides an email service with retry, circuit breaker, rate limiting, and fallback mechanisms.

## Features

- **Idempotency**: Ensures the same email is not sent multiple times.
- **Exponential Backoff**: Retries sending emails with increasing intervals upon failure.
- **Circuit Breaker**: Stops attempts to send emails when a certain number of failures occur.
- **Rate Limiting**: Restricts the number of requests to avoid exceeding service limits.
- **Fallback Provider**: Uses a secondary provider if the primary provider fails.

## Requirements

- Node.js (v14 or higher)

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Bhaskar-Varre/email-service.git
    cd email-service
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

## Configuration

1. **Configure email providers**: Update the `MockEmailProviderA` and `MockEmailProviderB` with real email provider configurations if necessary.


## Usage

1. **Start the server**:

    ```bash
    npm start
    ```

2. **Run tests**:

    ```bash
    npm test
    ```

## Testing

The project uses Jest for testing. Ensure that the email service and mock providers are set up correctly to pass the tests.
