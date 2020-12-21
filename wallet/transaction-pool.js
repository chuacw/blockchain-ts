// 90

const Transaction = require('./transaction');
class TransactionPool {

    constructor() {
        // represents a collections of transactions in the pool
        this.transactions = [];
    }

    /**
    * this method will add a transaction
    * it is possible that the transaction exists already
    * so it will replace the transaction with the new transaction
    * after checking the input id and adding new outputs if any
    * we call this method and replace the transaction in the pool
    */
    updateOrAddTransaction(transaction) {
        // get the transaction while checking if it exists
        let transactionWithId = this.transactions.find(t => t.id ===
            transaction.id);
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)]
                = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    // 127
    validTransactions() {
        /**
        * valid transactions are the one whose total output amounts to
        the input
        * and whose signatures are same
        */
        return this.transactions.filter((transaction) => {
            // reduce function adds up all the items and saves it in variable
            // passed in the arguments, second param is the initial value of the
            // sum total
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0)
            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}`);
                return;
            }
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }
            return transaction;
        })
    }

}
module.exports = TransactionPool;