// 19
import {Block} from './block';

class Blockchain {
    chain: any[];
    constructor() {
        this.chain = [Block.genesis()];
    }

    // 20
    addBlock(data: string | any[]) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }

    // 25
    isValidChain(chain: string | any[]) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if ((block.lastHash !== lastBlock.hash) || (block.hash !==
                Block.blockHash(block)))
                return false;
        }
        return true;
    }

    // 26
    replaceChain(newChain: string | any[]) {
        if (newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current chain");
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log("Received chain is invalid");
            return;
        }
        console.log("Replacing the current chain with new chain");
        (this.chain as any) = newChain;
    }

}

export { Blockchain };