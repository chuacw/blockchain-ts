import { Transaction } from '../wallet/transaction';
import { Wallet } from '../wallet/index';

describe('Transaction', () => {
    let transaction!: Transaction, wallet: Wallet, recipient: string, amount: number;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient,
            amount)!;
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        const output = transaction.outputs.find((output: { address: any; }) => output.address ===
            wallet.publicKey);
        expect(output!.amount).toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient', () => {
        const output = transaction.outputs.find((output: { address: any; }) => output.address ===
            recipient);
        expect(output!.amount).toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a invalid transaction', () => {
        transaction.outputs[0].amount = 500000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with less balance', () => {
        it('does not create the transaction', () => {
            expect(() => {
                amount = 5000;
                transaction = Transaction.newTransaction(wallet, recipient, amount);
            }).toThrow();
        });
    });

    describe('updated transaction', () => {
        let nextAmount: number, nextRecipient: string;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });
        it('subtracts the next amount from the sender\'s outputs', () => {
            const output = transaction.outputs.find((output: { address: any; }) => output.address
                === wallet.publicKey);
            expect(output!.amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });
        it('outputs an amount for the next recipient', () => {
            const recipient = transaction.outputs.find(
                (output: { address: string; }) => output.address === nextRecipient
            );
            expect(recipient!.amount).toEqual(nextAmount);
        });
    });
});