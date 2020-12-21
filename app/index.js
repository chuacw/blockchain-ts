// 98
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

// 50
const P2pserver = require('./p2p-server.js');
const express = require('express');
const Blockchain = require('../blockchain');

const bodyParser = require('body-parser');

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app = express();

//using the body parser middleware
app.use(bodyParser.json());

// create a new wallet
const wallet = new Wallet();
// create a new transaction pool which will be later
// decentralized and synchronized using the peer to peer server
const transactionPool = new TransactionPool();

// create a new blockchain instance
const blockchain = new Blockchain();
const p2pserver = new P2pserver(blockchain);

//EXPOSED APIs
//api to get the blocks
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

//api to add blocks
app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    // 58
    p2pserver.syncChain();
    res.redirect('/blocks');
});

// app server configurations
app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
});

// api to view balance of peer's balance
app.get('/balance', (req, res) => {
    res.json({ balance: wallet.balance });
});

p2pserver.listen(); // starts the p2pserver
