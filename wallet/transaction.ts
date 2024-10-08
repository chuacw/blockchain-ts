// 131
import { Wallet } from '.';
import { MINING_REWARD } from '../misc/config-constants';
import { ChainUtil } from '../misc/chain-util';

class TransactionInput {
    timestamp!: number;
    amount!: number;
    address!: string;
    signature: any;
}

class ErrorAmountExceedsBalance extends Error {
}

class TransactionOutput {
    amount!: number;
    address: any;
}

class Transaction {
    id: any;
    input: any;
    outputs: TransactionOutput[];

    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    // 82
    static newTransaction(senderWallet: Wallet, recipient: any, amount: number) {
        if (amount > senderWallet.balance) {
            console.log(`Amount : ${amount} exceeds the balance`);
            throw new ErrorAmountExceedsBalance(`Amount > balance: ${amount} > ${senderWallet.balance}`);
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
    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature:
                senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    // 84
    static verifyTransaction(transaction: { input: { address: any; signature: any; }; outputs: any; }) {
        const result =
            ChainUtil.verifySignature(
                transaction.input.address,
                transaction.input.signature,
                ChainUtil.hash(transaction.outputs)
            );
        return result;
    }

    // 85
    update(
        senderWallet: Wallet,
        recipient: any, amount: number) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amount > senderWallet.amount) {
            console.log(`Amount ${amount} exceeds balance`);
            new ErrorAmountExceedsBalance(`Amount > balance: ${amount} > ${senderWallet.balance}`);
        }
        senderOutput!.amount = senderOutput!.amount - amount;
        this.outputs.push({ amount: amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    // 129
    static transactionWithOutputs(senderWallet: any, outputs: { amount: any; address: any; }[]): Transaction {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    // 132
    static rewardTransaction(minerWallet: { publicKey: any; }, blockchainWallet: any): Transaction {
        return Transaction.transactionWithOutputs(
            blockchainWallet, [{
                amount: MINING_REWARD,
                address: minerWallet.publicKey
            }]);
    }

}

export { Transaction, TransactionOutput };