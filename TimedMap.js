// self expiring hash map

class TimedMap {
  constructor(expirationTimeMs) {
    this.data = {};
    this.expirationTimeMs = expirationTimeMs;
  }

  // set key with expiration
  set(key, value) {
    if (!this.data[key] || Date.now() >= this.data[key].expirationTime) {
      this.data[key] = {
        value,
        expirationTime: Date.now() + this.expirationTimeMs,
      };

      // Set a timeout to remove the entry when it expires
      setTimeout(() => {
        this.remove(key);
      }, this.expirationTimeMs);
    } else {
      // Update the value while keeping the previous expiration time
      this.data[key].value = value;
    }

    // TODO: add a set timeout to remove the count of network calls ie after every 2 sec for example, a network call aka api has finished its processing
    // => this.data[key].value=this.data[key].value -1;
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
