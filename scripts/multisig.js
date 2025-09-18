// btc-script-lab/scripts/multisig.js
// Bitcoin Script Learning Lab - 2-of-2 Multisig Example
// This script demonstrates how Bitcoin Script enables custom spending conditions

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: 2-of-2 Multisig ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate two keypairs (simulating 2 participants in a multisig wallet)
console.log("\n🔑 Generating keypairs for 2 participants...");
const keyPair1 = bitcoin.ECPair.makeRandom({ network });
const keyPair2 = bitcoin.ECPair.makeRandom({ network });

console.log("✅ KeyPair 1 generated");
console.log("✅ KeyPair 2 generated");

// Extract public keys (these will be used in the redeem script)
const pubkeys = [keyPair1.publicKey, keyPair2.publicKey];

console.log("\n📋 Public Keys:");
console.log("PubKey 1:", pubkeys[0].toString('hex'));
console.log("PubKey 2:", pubkeys[1].toString('hex'));

// Create the redeem script using P2MS (Pay-to-Multisig)
// This is the actual Bitcoin Script that defines spending conditions
console.log("\n📜 Creating redeem script...");
const redeemScript = bitcoin.payments.p2ms({ 
  m: 2,        // Require 2 signatures
  pubkeys,     // From these 2 public keys
  network 
});

console.log("✅ Redeem script created");
console.log("Redeem Script (hex):", redeemScript.output.toString('hex'));

// Create P2SH address (Pay-to-Script-Hash)
// This wraps our redeem script in a hash for better privacy and efficiency
console.log("\n🏠 Creating P2SH address...");
const { address, redeem } = bitcoin.payments.p2sh({
  redeem: redeemScript,
  network,
});

console.log("✅ P2SH address created");
console.log("Multisig Address (P2SH):", address);

// Display the Bitcoin Script in human-readable format
console.log("\n📖 Bitcoin Script Breakdown:");
console.log("The redeem script contains:");
console.log("1. OP_2 (require 2 signatures)");
console.log("2. PubKey 1 (33 bytes)");
console.log("3. PubKey 2 (33 bytes)");
console.log("4. OP_2 (total of 2 public keys)");
console.log("5. OP_CHECKMULTISIG (verify signatures)");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("Key1 WIF:", keyPair1.toWIF());
console.log("Key2 WIF:", keyPair2.toWIF());

console.log("\n💡 How to spend from this address:");
console.log("1. Fund the address with testnet BTC");
console.log("2. Create a transaction spending from this address");
console.log("3. Provide 2 signatures (one from each private key)");
console.log("4. Include the redeem script in the transaction");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to the multisig address");
console.log("- Use the web interface to create and sign transactions");
console.log("- Experiment with different script conditions");

console.log("\n=== End of Multisig Generation ===");

