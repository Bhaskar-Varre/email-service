const EmailService = require('./src/EmailService');
const { MockEmailProviderA, MockEmailProviderB } = require('./src/MockEmailProvider');

const emailService = new EmailService(new MockEmailProviderA(), new MockEmailProviderB());

const email = { id: 'email-1', to: 'test@example.com', body: 'Hello!' };

emailService.sendEmail(email);
