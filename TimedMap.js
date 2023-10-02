// self expiring hash map

class TimedMap {
    constructor(expirationTimeMs) {
      this.data = {};
      this.expirationTimeMs = expirationTimeMs;
    }
  
    // set key with expiration
    set(key, value) {
      console.log(Date.now())
      if (!this.data[key] || Date.now() >= this.data[key].expirationTime) {
        this.data[key] = {
          value,
          expirationTime: Date.now() + this.expirationTimeMs,
        };
  
        // Set a timeout to remove the entry when it expires
        setTimeout(() => {
          this.remove(key);
        }, this.expirationTimeMs);
      }else {
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
    console.log(Date.now())
    delete this.data[key];
  }
}

module.exports=TimedMap