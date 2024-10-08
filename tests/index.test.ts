// 95

import { Wallet } from '../wallet/index';
import { TransactionPool } from '../wallet/transaction-pool';
import { Blockchain } from '../blockchain';
import { INITIAL_BALANCE } from '../misc/config-constants';

describe('Wallet', () => {
    let wallet: Wallet, transactionPool: TransactionPool, blockchain: Blockchain;
    wallet = new Wallet();
    transactionPool = new TransactionPool();
    beforeEach(() => {
        wallet = new Wallet();
        transactionPool = new TransactionPool();
        blockchain = new Blockchain();
    });
    describe('creating a transaction', () => {
        let transaction: { outputs: any[]; }, sendAmount: number, recipient: string;
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount,
                blockchain, // 146
                transactionPool);
        });
        describe(' and doing the same transaction', () => {
            beforeEach(() => {
                // this will create another output for the same transaction
                wallet.createTransaction(recipient, sendAmount, blockchain, // 146
                    transactionPool);
            });
            // this will check if the output address back to the sender is reduced twice the sendAmount
            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find((output: { address: any; }) => output.address ===
                    wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });
            // checks if output was created again
            it('clones the `sendAmount`output for the transaction ', () => {
                // filter will return only those items that satisfy the condition
                // hence an array of only the required outputs
                // map will do some processing over each individual item and replace it with something
                // else here the amount of the output
                expect(transaction.outputs.filter((output: { address: any; }) => output.address ===
                    recipient).map((output: { amount: any; }) => output.amount)).toEqual([sendAmount,
                        sendAmount]);
            });
        });
    });

    // 147
    describe('calculating the balance', () => {
        let addBalance: number, repeatAdd: number, senderWallet: Wallet;
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance,
                    blockchain, transactionPool);
            }
            blockchain.addBlock(transactionPool.transactions);
        });
        it('calculates the balance for the blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE +
                (addBalance * repeatAdd));
        });
        it('calculates the balance for the blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });
        describe('and the recipient conducts a transaction', () => {
            let subtractBalance: number, recipientBalance: number;
            beforeEach(() => {
                transactionPool.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(blockchain);
                wallet.createTransaction(senderWallet.publicKey,
                    subtractBalance, blockchain, transactionPool);
                blockchain.addBlock(transactionPool.transactions);
            });
            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    transactionPool.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance,
                        blockchain, transactionPool);
                    blockchain.addBlock(transactionPool.transactions);
                });
                it('calculate the recipient balance only using transactions since its most recent one', () => {
                    expect(wallet.calculateBalance(blockchain)).toEqual(recipientBalance -
                        subtractBalance + addBalance);
                });
            });
        });
    });
});
