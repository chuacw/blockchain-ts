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
        const transaction = new this();
        transaction.outputs.push(...[
            {
                amount: senderWallet.balance - amount, address:
                    senderWallet.publicKey
            },
            { amount: amount, address: recipient }
        ]);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
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

}

module.exports = Transaction;