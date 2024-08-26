class RateLimiter {
    constructor(limit, interval) {
      this.limit = limit;
      this.interval = interval;
      this.timestamps = [];
    }
  
    check() {
      const now = Date.now();
  
      // Remove outdated timestamps
      this.timestamps = this.timestamps.filter(timestamp => now - timestamp < this.interval);
  
      if (this.timestamps.length >= this.limit) {
        throw new Error('Rate limit exceeded.');
      }
  
      this.timestamps.push(now);
    }
  }
  
  module.exports = RateLimiter;
  