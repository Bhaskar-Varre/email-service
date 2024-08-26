class MockEmailProviderA {
  async send(email) {
    console.log('Sending email via MockEmailProviderA...');
    if (Math.random() < 0.5) {
      throw new Error('Failed to send email via MockEmailProviderA.');
    }
    console.log('Email sent via MockEmailProviderA.');
  }
}

class MockEmailProviderB {
  async send(email) {
    console.log('Sending email via MockEmailProviderB...');
    if (Math.random() < 0.5) {
      throw new Error('Failed to send email via MockEmailProviderB.');
    }
    console.log('Email sent via MockEmailProviderB.');
  }
}

module.exports = { MockEmailProviderA, MockEmailProviderB };
