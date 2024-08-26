
class CircuitBreaker {
    constructor(failureThreshold, resetTime) {
        this.failureThreshold = failureThreshold;
        this.resetTime = resetTime;
        this.failures = 0;
        this.lastFailureTime = 0;
        this.state = 'CLOSED'; 
    }

    recordFailure() {
        const now = Date.now();
        if (now - this.lastFailureTime > this.resetTime) {
            this.failures = 0; 
            this.state = 'CLOSED';
        }

        this.failures += 1;
        this.lastFailureTime = now;

        if (this.failures >= this.failureThreshold) {
            this.openCircuit();
        }
    }

    openCircuit() {
        this.state = 'OPEN';
        this.lastFailureTime = Date.now();
    }

    isOpen() {
        if (this.state === 'OPEN' && Date.now() - this.lastFailureTime >= this.resetTime) {
            this.state = 'HALF_OPEN'; // Allow some requests to test if the service is back
        }
        return this.state === 'OPEN';
    }

    reset() {
        this.state = 'CLOSED';
        this.failures = 0;
        this.lastFailureTime = 0;
    }
}

module.exports = CircuitBreaker;
