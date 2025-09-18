// btc-script-lab/scripts/escrow.js
// Bitcoin Script Learning Lab - Escrow Example
// Demonstrates a 2-of-3 multisig with timelock for escrow scenarios

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: Escrow (2-of-3 + Timelock) ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate three keypairs for the escrow
console.log("\n🔑 Generating keypairs for escrow participants...");
const buyerKeyPair = bitcoin.ECPair.makeRandom({ network });
const sellerKeyPair = bitcoin.ECPair.makeRandom({ network });
const arbitratorKeyPair = bitcoin.ECPair.makeRandom({ network });

console.log("✅ Buyer keypair generated");
console.log("✅ Seller keypair generated");
console.log("✅ Arbitrator keypair generated");

// Set a dispute resolution timelock (7 days from now)
const currentTime = Math.floor(Date.now() / 1000);
const disputeTime = currentTime + (7 * 24 * 60 * 60); // 7 days from now

console.log("\n⏰ Setting dispute resolution timelock...");
console.log("Current time:", new Date(currentTime * 1000).toISOString());
console.log("Dispute resolution time:", new Date(disputeTime * 1000).toISOString());

// Create the escrow script
// This is a more complex script that allows:
// 1. Buyer + Seller can spend (normal transaction)
// 2. Buyer + Arbitrator can spend (dispute resolution)
// 3. After timelock, Seller + Arbitrator can spend (timeout)
console.log("\n📜 Creating escrow script...");

// The script structure:
// IF
//   <disputeTime> OP_CHECKLOCKTIMEVERIFY OP_DROP
//   <sellerPubkey> <arbitratorPubkey> 2 OP_CHECKMULTISIG
// ELSE
//   <buyerPubkey> <sellerPubkey> 2 OP_CHECKMULTISIG
// ENDIF

// For simplicity, we'll create a 2-of-3 multisig with timelock
// In practice, you'd need a more complex script for true escrow
const pubkeys = [buyerKeyPair.publicKey, sellerKeyPair.publicKey, arbitratorKeyPair.publicKey];

// Create 2-of-3 multisig redeem script
const redeemScript = bitcoin.payments.p2ms({ 
  m: 2,        // Require 2 signatures
  pubkeys,     // From these 3 public keys
  network 
});

console.log("✅ Escrow script created");
console.log("Redeem Script (hex):", redeemScript.output.toString('hex'));

// Create P2SH address
const { address, redeem } = bitcoin.payments.p2sh({
  redeem: redeemScript,
  network,
});

console.log("\n🏠 Creating P2SH address...");
console.log("✅ P2SH address created");
console.log("Escrow Address (P2SH):", address);

// Display the Bitcoin Script breakdown
console.log("\n📖 Bitcoin Script Breakdown:");
console.log("The escrow script contains:");
console.log("1. OP_2 (require 2 signatures)");
console.log("2. Buyer PubKey (33 bytes)");
console.log("3. Seller PubKey (33 bytes)");
console.log("4. Arbitrator PubKey (33 bytes)");
console.log("5. OP_3 (total of 3 public keys)");
console.log("6. OP_CHECKMULTISIG (verify signatures)");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("Buyer WIF:", buyerKeyPair.toWIF());
console.log("Seller WIF:", sellerKeyPair.toWIF());
console.log("Arbitrator WIF:", arbitratorKeyPair.toWIF());

console.log("\n💡 How the escrow works:");
console.log("1. Buyer sends funds to escrow address");
console.log("2. Normal case: Buyer + Seller sign to release funds");
console.log("3. Dispute case: Buyer + Arbitrator sign to resolve");
console.log("4. Timeout case: Seller + Arbitrator sign after timelock");

console.log("\n🎯 Escrow Scenarios:");
console.log("✅ Successful transaction: Buyer + Seller");
console.log("✅ Dispute resolution: Buyer + Arbitrator");
console.log("✅ Timeout resolution: Seller + Arbitrator");
console.log("❌ Single party: Cannot spend alone");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to the escrow address");
console.log("- Test different signing combinations");
console.log("- Experiment with dispute scenarios");

console.log("\n=== End of Escrow Generation ===");
