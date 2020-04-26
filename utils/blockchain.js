const Block = require('./block')
const _ = require('lodash');

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
            if (this.chain[i].hash !== this.chain[i].getHash())
                return false;
            if (i > 0 && this.chain[i].prevHash !== this.chain[i - 1].hash)
                return false;
        }
        return true;
    }

    blockIsValid(data) {
        let currentBlock = this.chain[this.chain.length - 1];
        let blockData = JSON.parse(JSON.stringify(currentBlock));
        let tempData = _.cloneDeep(blockData);
        
        //initializing temp data with the data from the file
        tempData.data = (data).toString();
        delete tempData.hash;

        //structuring the block with the filedata
        let tempBlock = this.restructBlock(tempData);
        tempData = JSON.parse(JSON.stringify(tempBlock));

        return blockData.hash === tempData.hash;
    }
}

module.exports = BlockChain