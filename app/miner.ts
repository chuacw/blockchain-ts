// 125
import { Transaction } from '../wallet/transaction';
import { Wallet } from '../wallet/index';
import { Blockchain } from '../blockchain';
import { TransactionPool } from '../wallet/transaction-pool';
import { P2pserver } from './p2p-server';

class Miner {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: Wallet;
    p2pServer: P2pserver;

    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: Wallet, p2pServer: P2pserver) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        const validTransactions =
            this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet,
            Wallet.blockchainWallet()));
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChain();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransactions();

        return block;
    }

}

export { Miner };
