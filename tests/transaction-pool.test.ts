// 146
import { Blockchain } from '../blockchain';

// 140
import { MINING_REWARD } from '../misc/config-constants';

import { TransactionPool } from '../wallet/transaction-pool';
import { Transaction } from '../wallet/transaction';
import { Wallet } from '../wallet/index';

describe('Transaction Pool', () => {

    let transactionPool!: TransactionPool;
    let wallet!: Wallet;
    let transaction!: Transaction;
    let blockchain!: Blockchain;
    let newTransaction!: Transaction;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        wallet = new Wallet();
        blockchain = new Blockchain(); // 146
        transaction = wallet.createTransaction('r4nd-addr355', 30,
            blockchain, // 146
            transactionPool);
    });

    it('adds a transaction to the pool', () => {
        expect(transactionPool.transactions.find((t: { id: any; }) => t.id ===
            transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        newTransaction = transaction.update(wallet!, 'foo-4ddr355', 40)!;
        transactionPool.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(transactionPool.transactions.find((t: { id: any; }) => t.id
            === transaction.id)))
            .not.toEqual(oldTransaction);
    });

    // 139
    it('clears transactions', () => {
        transactionPool.clear();
        expect(transactionPool.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions: any[];
        beforeEach(() => {
            validTransactions = [...transactionPool.transactions];
            // creating new transactions with corrupt transactions
            for (let i = 0; i < 6; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4ddr355', 30,
                    blockchain, // 146
                    transactionPool);
                if (i & 1) {
                    transaction.input.amount = 999999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });
        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.
                stringify(validTransactions));
        });
        it('grabs valid transactions', () => {
            let actualTransactions = transactionPool.validTransactions();
            expect(actualTransactions).toEqual(validTransactions);
        });
    });

    // 140
    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet,
                Wallet.blockchainWallet());
        });
        it('reward the miners wallet', () => {
            const output = transaction.outputs.find((output: { address: any; }) => output.address ===
                wallet.publicKey);
            expect(output!.amount).toEqual(MINING_REWARD);
        });
    });

});