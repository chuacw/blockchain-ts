// 131
const { MINING_REWARD } = require('../config.js');

const ChainUtil = require('../chain-util');

class Transaction {

    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    // 82
    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount : ${amount} exceeds the balance`);
            return;
        }
        // const transaction = new this();
        // transaction.outputs.push(...[
        //     {
        //         amount: senderWallet.balance - amount, address:
        //             senderWallet.publicKey
        //     },
        //     { amount: amount, address: recipient }
        // ]);
        // Transaction.signTransaction(transaction, senderWallet);
        // return transaction;

        // 130

        return Transaction.transactionWithOutputs(senderWallet,
            [
                {
                    amount: senderWallet.balance - amount, 
                    address: senderWallet.publicKey
                },
                { amount: amount, address: recipient }
            ]
        );
    }

    // 83
    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature:
                senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    // 84
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }

    // 85
    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amount > senderWallet.amount) {
            console.log(`Amount ${amount} exceeds balance`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount: amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    // 129
    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

}

module.exports = Transaction;