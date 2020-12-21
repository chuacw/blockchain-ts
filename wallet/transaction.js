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

}

module.exports = Transaction;