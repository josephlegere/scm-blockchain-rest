const crypto = require('crypto');

class Block {
    constructor(index, data, prevHash, timestamp = null, hash = null) {
        this.index = index
        this.timestamp = (timestamp === null ? Math.floor(Date.now() / 1000) : timestamp)
        this.data = data
        this.prevHash = prevHash
        this.hash = (hash === null ? this.getHash() : hash)
    }

    getHash() {
        let encrypt = JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp
        let hash = crypto.createHmac('sha256', 'secret')
            .update(encrypt)
            .digest('hex');

        return hash;
    }
}

module.exports = Block