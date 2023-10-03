// self expiring hash map

class TimedMap {
  constructor(expirationTimeMs) {
    this.data = {};
    this.expirationTimeMs = expirationTimeMs;
  }

  // set key with expiration
  set(key, value, apiProcessingTimeMs) {
    if (!this.data[key] || Date.now() >= this.data[key].expirationTime) {
      this.data[key] = {
        value,
        expirationTime: Date.now() + this.expirationTimeMs,
      };

      // Set a timeout to remove the entry when it expires
      setTimeout(() => {
        this.remove(key);
      }, this.expirationTimeMs);

      // api processing time (remove api call is it has done processing)
      let time = setInterval(() => {
        if (this.data[key]?.value > 0) {
          this.data[key].value = this.data[key].value - 1;
        } else {
          clearInterval(time);
        }
      }, apiProcessingTimeMs);
    } else {
      // Update the value while keeping the previous expiration time
      this.data[key].value = value;
    }
  }

  // Get key if exists or not expired
  get(key) {
    const entry = this.data[key];
    if (entry && Date.now() < entry.expirationTime) {
      return entry.value;
    }
    return undefined;
  }

  // remove key
  remove(key) {
    delete this.data[key];
  }
}

module.exports = TimedMap;
