const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ExponentialBackoff = async (attempt) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delayTime = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  await delay(delayTime);
};

module.exports = ExponentialBackoff;
