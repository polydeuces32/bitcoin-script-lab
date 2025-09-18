// btc-script-lab/scripts/lightning.js
// Bitcoin Script Learning Lab - Lightning Network Scripts
// Demonstrates Lightning Network payment channel scripts

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: Lightning Network Scripts ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate keypairs for Lightning Network
console.log("\n🔑 Generating keypairs for Lightning Network...");
const aliceKeyPair = bitcoin.ECPair.makeRandom({ network });
const bobKeyPair = bitcoin.ECPair.makeRandom({ network });
const aliceRevocationKey = bitcoin.ECPair.makeRandom({ network });
const bobRevocationKey = bitcoin.ECPair.makeRandom({ network });

console.log("✅ Alice keypair generated");
console.log("✅ Bob keypair generated");
console.log("✅ Alice revocation key generated");
console.log("✅ Bob revocation key generated");

// Create Lightning Network commitment transaction script
console.log("\n📜 Creating Lightning Network commitment script...");

// Lightning Network HTLC (Hash Time Locked Contract) script
// This script allows either party to spend with their signature,
// or the other party can spend with revocation key after timeout
const createLightningScript = (localKey, remoteKey, revocationKey, delay) => {
    // Script: OP_IF
    //   <revocationKey> OP_CHECKSIG
    // OP_ELSE
    //   <delay> OP_CHECKSEQUENCEVERIFY OP_DROP
    //   <remoteKey> OP_CHECKSIG
    // OP_ENDIF
    
    const script = bitcoin.script.compile([
        bitcoin.opcodes.OP_IF,
        revocationKey.publicKey,
        bitcoin.opcodes.OP_CHECKSIG,
        bitcoin.opcodes.OP_ELSE,
        bitcoin.script.number.encode(delay),
        bitcoin.opcodes.OP_CHECKSEQUENCEVERIFY,
        bitcoin.opcodes.OP_DROP,
        remoteKey.publicKey,
        bitcoin.opcodes.OP_CHECKSIG,
        bitcoin.opcodes.OP_ENDIF
    ]);
    
    return script;
};

// Create commitment scripts for both parties
const aliceCommitmentScript = createLightningScript(
    aliceKeyPair, 
    bobKeyPair, 
    aliceRevocationKey, 
    144 // 24 hours delay
);

const bobCommitmentScript = createLightningScript(
    bobKeyPair, 
    aliceKeyPair, 
    bobRevocationKey, 
    144 // 24 hours delay
);

console.log("✅ Alice commitment script created");
console.log("✅ Bob commitment script created");

// Create P2SH addresses
const aliceCommitment = bitcoin.payments.p2sh({
    redeem: { output: aliceCommitmentScript },
    network,
});

const bobCommitment = bitcoin.payments.p2sh({
    redeem: { output: bobCommitmentScript },
    network,
});

console.log("\n🏠 Creating P2SH addresses...");
console.log("✅ Alice commitment address created");
console.log("Alice Commitment Address (P2SH):", aliceCommitment.address);
console.log("✅ Bob commitment address created");
console.log("Bob Commitment Address (P2SH):", bobCommitment.address);

// Display Lightning Network concepts
console.log("\n📖 Lightning Network Concepts:");
console.log("1. **Payment Channels** - Off-chain payment channels between two parties");
console.log("2. **HTLC Scripts** - Hash Time Locked Contracts for secure payments");
console.log("3. **Commitment Transactions** - On-chain transactions that can be updated");
console.log("4. **Revocation Keys** - Keys that allow punishment for cheating");

// Script breakdown
console.log("\n📖 Lightning Script Breakdown:");
console.log("The commitment script contains:");
console.log("1. OP_IF - Conditional execution");
console.log("2. <revocationKey> OP_CHECKSIG - Immediate spend with revocation key");
console.log("3. OP_ELSE - Alternative execution path");
console.log("4. <delay> OP_CHECKSEQUENCEVERIFY - Time lock check");
console.log("5. OP_DROP - Remove delay from stack");
console.log("6. <remoteKey> OP_CHECKSIG - Spend with remote key after delay");
console.log("7. OP_ENDIF - End conditional");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("Alice WIF:", aliceKeyPair.toWIF());
console.log("Bob WIF:", bobKeyPair.toWIF());
console.log("Alice Revocation WIF:", aliceRevocationKey.toWIF());
console.log("Bob Revocation WIF:", bobRevocationKey.toWIF());

console.log("\n💡 How Lightning Network works:");
console.log("1. **Channel Opening** - Both parties fund a 2-of-2 multisig");
console.log("2. **Payment Updates** - Create new commitment transactions");
console.log("3. **Channel Closing** - Broadcast final commitment transaction");
console.log("4. **Dispute Resolution** - Use revocation keys if needed");

console.log("\n🎯 Use Cases:");
console.log("✅ **Micropayments** - Fast, cheap small payments");
console.log("✅ **Scalability** - Process millions of transactions");
console.log("✅ **Privacy** - Off-chain transactions are private");
console.log("✅ **Instant Settlement** - No waiting for confirmations");

console.log("\n🧪 Next Steps:");
console.log("- Fund the commitment addresses with testnet BTC");
console.log("- Test channel opening and closing");
console.log("- Experiment with payment updates");
console.log("- Learn about Lightning Network routing");

console.log("\n=== End of Lightning Network Generation ===");
