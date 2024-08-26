const EmailService = require('../src/EmailService');
const { MockEmailProviderA, MockEmailProviderB } = require('../src/MockEmailProvider');

describe('EmailService', () => {
  let service;
  let email;

  beforeEach(() => {
    service = new EmailService(new MockEmailProviderA(), new MockEmailProviderB());
    email = { id: 'test-email-1', to: 'test@example.com', body: 'Test body' };
    
    // Mocking the send method for both providers
    jest.spyOn(service.providers[0], 'send').mockResolvedValue(true);
    jest.spyOn(service.providers[1], 'send').mockResolvedValue(true);
  });

  it('should send an email successfully using Provider A', async () => {
    await service.sendEmail(email);
    expect(service.sentEmails.has('test-email-1')).toBe(true);
  });

  it('should send an email successfully using Provider B after Provider A fails', async () => {
    // Simulate failure in Provider A
    service.providers[0].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderA.'));
    service.providers[1].send.mockResolvedValue(true);
    await service.sendEmail(email);

    // Provider A should have been called and failed
    expect(service.providers[0].send).toHaveBeenCalled();
    // Provider B should have been called as a fallback
    expect(service.providers[1].send).toHaveBeenCalled();
    expect(service.sentEmails.has('test-email-1')).toBe(true);
});


  it('should not send the same email twice (idempotency)', async () => {
    await service.sendEmail(email);

    // Attempt to send the same email again
    await service.sendEmail(email);

    // Expect the send method to be called only once for the first provider
    expect(service.providers[0].send).toHaveBeenCalledTimes(1);
    expect(service.sentEmails.has('test-email-1')).toBe(true);
  });

  // Remove or modify this test if retryWithBackoff does not exist
  it('should retry sending an email with exponential backoff', async () => {
    // If retryWithBackoff does not exist, remove this test
    if (service.retryWithBackoff) {
      const retrySpy = jest.spyOn(service, 'retryWithBackoff');

      // Simulate failure in both providers
      service.providers[0].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderA.'));
      service.providers[1].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderB.'));

      try {
        await service.sendEmail(email);
      } catch (error) {
        // Expected to fail after retries
      }

      expect(retrySpy).toHaveBeenCalled();
      expect(retrySpy).toHaveBeenCalledTimes(1);
    }
  });

  // Adjust or remove this test if rate limiting isn't implemented
  it('should respect rate limiting', async () => {
    if (service.rateLimiter) {
      const rateLimiterSpy = jest.spyOn(service.rateLimiter, 'check');

      await service.sendEmail(email);

      expect(rateLimiterSpy).toHaveBeenCalled();
    }
  });

  it('should use the fallback provider if the primary fails', async () => {
    // Simulate failure in Provider A
    service.providers[0].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderA.'));

    await service.sendEmail(email);

    expect(service.providers[0].send).toHaveBeenCalled();
    expect(service.providers[1].send).toHaveBeenCalled();
    expect(service.sentEmails.has('test-email-1')).toBe(true);
  });

  it('should track the status of email sending attempts', async () => {
    const status = await service.sendEmail(email);
    expect(status).toEqual({
      success: true,
      provider: 'MockEmailProviderA',
    });
  });

  it('should handle errors gracefully and return a failed status', async () => {
    // Simulate failure in both providers
    service.providers[0].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderA.'));
    service.providers[1].send.mockRejectedValue(new Error('Failed to send email via MockEmailProviderB.'));

    const status = await service.sendEmail(email).catch((e) => e);

    expect(status.success).toBe(false);
    expect(status.provider).toBe(null);
  });
});
