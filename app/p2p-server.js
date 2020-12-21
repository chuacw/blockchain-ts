// 113
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS' // 135
}

// 49

const WebSocket = require('ws');

// declare the peer to peer server port

const P2P_PORT = process.env.P2P_PORT || 5001;
//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
class P2pserver {

    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.transactionPool = transactionPool;
    }

    // create a new p2p server and connections
    listen() {
        // create the p2p server with port as argument
        const server = new WebSocket.Server({ port: P2P_PORT });
        // event listener and a callback function for any new connection
        // on any new connection the current instance will send the current chain
        // to the newly connected peer
        server.on('connection', socket => this.connectSocket(socket));
        // to connect to the peers that we have specified
        this.connectToPeers();
        console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
    }

    // after making connection to a socket
    connectSocket(socket) {
        // push the socket to the socket array
        this.sockets.push(socket);
        console.log("Socket connected");

        // 57
        // register a message event listener to the socket
        this.messageHandler(socket);
        // on new connection send the blockchain chain to the peer
        this.sendChain(socket);
    }

    connectToPeers() {
        //connect to each peer
        peers.forEach(peer => {
            // create a socket for each peer
            const socket = new WebSocket(peer);
            // open event listener is emitted when a connection is established
            // saving the socket in the array
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    // 55
    messageHandler(socket) {
        // on receiving a message execute a callback function

        // 116
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log("data ", data);
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    /**
                    * call replace blockchain if the
                    * received chain is longer it will replace it
                    */
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    /**
                    * add transaction to the transaction
                    * pool or replace with existing one
                    */
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    /**
                    * clear the transaction pool
                    */
                    this.transactionPool.clear();
                    break;
            }
        });
    }

    // 56
    sendChain(socket) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.chain,
                chain: this.blockchain.chain
            })
        ); // 115
    }

    syncChain() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify(
            {
                type: MESSAGE_TYPE.transaction,
                transaction: transaction
            })
        );
    }

    // 136
    broadcastClearTransactions() {
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPE.clear_transactions
            }))
        })
    }

}

module.exports = P2pserver;