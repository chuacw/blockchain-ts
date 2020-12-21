// 125

const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');

class Miner {

    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

}

module.exports = Miner;
