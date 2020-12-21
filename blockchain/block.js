// 67
const { DIFFICULTY, MINE_RATE } = require('../config.js');

// 10
const SHA256 = require('crypto-js/sha256');

// 6
class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    // 7
    toString() {
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0, 10)}
        Hash : ${this.hash.substring(0, 10)}
        Data : ${this.data}`;
    }

    // 8
    static genesis() {
        return new this('Genesis time', '----', 'genesis-hash', []);
    }

    // 11
    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    // 12
    static mineBlock(lastBlock, data) {
        let hash;
        let timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        //generate the hash of the block
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
            // check if we have the required no of leading number of zeros
        } while (hash.substring(0, difficulty) !==
            '0'.repeat(difficulty));
        return new this(timestamp, lastHash, hash, data, nonce,
            difficulty);
    }

    // 24
    static blockHash(block) {
        //destructuring
        const { timestamp, lastHash, data } = block;
        return Block.hash(timestamp, lastHash, data);
    }

    // 68
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
            difficulty + 1 : difficulty - 1;
        return difficulty;
    }

}
module.exports = Block;