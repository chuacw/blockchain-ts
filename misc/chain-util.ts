// 77

// const EC = require('elliptic').ec;
import { BNInput, ec as EC, SignatureInput } from 'elliptic';
const ec = new EC('secp256k1');

import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'crypto-js/sha256';
import { TransactionOutput } from '../wallet/transaction';

class ChainUtil {

    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidv4();
    }

    static hash(data: string | TransactionOutput[]): string {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey: string | Uint8Array | Buffer | number[] | EC.KeyPair | { x: string; y: string; }, signature: SignatureInput, dataHash: BNInput): boolean {
        const key: EC.KeyPair = ec.keyFromPublic(publicKey, 'hex');
        const result = key.verify(dataHash, signature);
        return result;
    }

}

export { ChainUtil };