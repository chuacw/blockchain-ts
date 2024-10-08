// 79
import { ChainUtil } from '../misc/chain-util';

// 67
import { DIFFICULTY, MINE_RATE } from '../misc/config-constants';

// 10
// const SHA256 = require('crypto-js/sha256');

// 6
class Block {
    timestamp: string;
    lastHash: string;
    hash: string;
    data: any;
    nonce: any;
    difficulty: any;

    constructor(timestamp: any, lastHash: any, hash: any, data: any, nonce: any, difficulty: number) {
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
        Data : ${this.data}
        Nonce : ${this.nonce}
        Difficulty: ${this.difficulty}`; // 70
    }

    // 8
    static genesis() {
        return new this('Genesis time', '----', 'genesis-hash', [], 0, DIFFICULTY); // 70
    }

    // 11
    static hash(timestamp: number, lastHash: any, data: any, nonce: number, difficulty: any) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString(); // 80 
    }

    // 12
    static mineBlock(lastBlock: Block, data: string | any[]) {
        let hash;
        let timestamp: number;
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
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(timestamp, lastHash, hash, data, nonce,
            difficulty);
    }

    // 24
    static blockHash(block: { timestamp: any; lastHash: any; data: any; nonce: any; difficulty: any; }) {
        // destructuring
        const { timestamp, lastHash, data, nonce, difficulty } = block; // 70
        return Block.hash(timestamp, lastHash, data, nonce, difficulty); // 70
    }

    // 68
    static adjustDifficulty(lastBlock: Block, currentTime: number) {
        let { difficulty } = lastBlock;
        difficulty = (lastBlock.timestamp as unknown as number) + MINE_RATE > currentTime ?
            difficulty + 1 : difficulty - 1;
        return difficulty;
    }

}

export { Block };