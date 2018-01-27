
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var Accounts = require('web3-eth-accounts');


exports.createSmartContract = functions.database.ref('/elections/{n}')
    .onWrite(event => {

        // Grab vote values
        const vote = event.data.val();
        const userKey = vote.userKey

        console.log('Registering Vote', event.params.userDUI, vote);

        const candidateRef = event.data.adminRef.database.ref("elections/" + vote.electionKey + "/candidates/" + vote.candidateKey + "/votes")

        candidateRef.once('value').then(function (votes) {
            const votesCount = votes.val() + 1;
            console.log("Votes Count", votesCount);
            return candidateRef.set(votesCount);
        });
    });



exports.createWallet = functions.database.ref('/users/{dui}/dui')
    .onWrite(event => {

        const user = event.data.val();

        // Only edit data when it is first created.
        if (event.data.previous.exists()) {
            return null;
        }

        // eth
        var accounts = new Accounts('https://rinkeby.infura.io/eInOo2g7yiO2laP7evVq');

        var wallet = web3.eth.accounts.create();

        return event.data.ref.parent.child('wallet').set(wallet);


    });