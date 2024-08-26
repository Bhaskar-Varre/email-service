const ExponentialBackoff = require('./ExponentialBackoff');
const RateLimiter = require('./RateLimiter');
const CircuitBreaker = require('./CircuitBreaker');

class EmailService {
  constructor(providerA, providerB) {
    this.providers = [providerA, providerB];
    this.sentEmails = new Set();
    this.rateLimiter = new RateLimiter(5, 60000); // 5 requests per minute
    this.circuitBreaker = new CircuitBreaker(3, 30000); // 3 failures within 30 seconds
  }
  async sendEmail(email) {
    const emailId = email.id;

    if (this.sentEmails.has(emailId)) {
      console.log('Email already sent.');
      return { success: true, provider: null };
    }

    for (let attempt = 0; attempt < this.providers.length; attempt++) {
        const provider = this.providers[attempt];
        try {
            console.log(`Attempting to send email with ${provider.constructor.name} (attempt ${attempt + 1})`);

            await this.rateLimiter.check();

            if (this.circuitBreaker.isOpen()) {
                console.log('Circuit breaker is open, cannot send email.');
                return { success: false, provider: null };
            }

            console.log(`Attempting to send email with ${provider.constructor.name} (attempt ${attempt + 1})`);
            await provider.send(email);

            this.sentEmails.add(emailId);
            console.log('Email sent successfully.');
            return { success: true, provider: provider.constructor.name };
        } catch (error) {
            console.log(`Error with provider ${provider.constructor.name}: ${error.message}`);
            this.circuitBreaker.recordFailure();
            await ExponentialBackoff(attempt);

            if (attempt === this.providers.length - 1) {
                console.log('Failed to send email after retrying all providers.');
                return { success: false, provider: null };
            }
        }
    }

    console.log('Failed to send email after retrying all providers.');
    return { success: false, provider: null };
}

  
  

    
}

module.exports = EmailService;
