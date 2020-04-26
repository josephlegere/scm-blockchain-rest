const Block = require('./block')

class BlockChain {
    constructor() {
        this.chain = [];
    }

    updateChain(chain) {
        this.chain = chain
    }

    restructChain(chain) {
        let _chain = [];
        chain.forEach(elem => {
            _chain.push(this.restructBlock(elem));
        });
        //console.log(_chain)
        this.chain = _chain;
    }

    addBlock(data) {
        let index = this.chain.length;
        let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0
        let block = new Block(index, data, prevHash);
        //console.log(block)
        //delete block.data //data property is deleted, doesn't need to be included
        this.chain.push(block);
    }

    restructBlock(props) {
        return new Block(props.index, props.data, props.prevHash, props.timestamp, props.hash);
    }

    chainIsValid() {
        for (let i = 0; i < this.chain.length; i++) {
            console.log(this.chain[i].hash)
            console.log(this.chain[i].getHash())
            console.log(this.chain[i].hash !== this.chain[i].getHash())
            if (this.chain[i].hash !== this.chain[i].getHash())
                return false;
            if (i > 0 && this.chain[i].prevHash !== this.chain[i - 1].hash)
                return false;
        }
        return true;
    }
}

module.exports = BlockChain