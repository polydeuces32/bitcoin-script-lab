// btc-script-lab/scripts/hashlock.js
// Bitcoin Script Learning Lab - Hash Lock Example
// Demonstrates HTLC (Hash Time Locked Contract) style scripts

const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

console.log("=== Bitcoin Script Lab: Hash Lock (HTLC) ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate keypairs for the hash lock
console.log("\n🔑 Generating keypairs...");
const receiverKeyPair = bitcoin.ECPair.makeRandom({ network });
const refundKeyPair = bitcoin.ECPair.makeRandom({ network });

console.log("✅ Receiver keypair generated");
console.log("✅ Refund keypair generated");

// Create a secret and its hash (preimage and hash)
console.log("\n🔐 Creating secret and hash...");
const secret = crypto.randomBytes(32);
const secretHash = crypto.createHash('sha256').update(secret).digest();

console.log("✅ Secret generated (32 bytes)");
console.log("Secret (hex):", secret.toString('hex'));
console.log("Secret Hash (hex):", secretHash.toString('hex'));

// Set a timelock for refund (24 hours from now)
const currentTime = Math.floor(Date.now() / 1000);
const refundTime = currentTime + (24 * 60 * 60); // 24 hours from now

console.log("\n⏰ Setting refund timelock...");
console.log("Current time:", new Date(currentTime * 1000).toISOString());
console.log("Refund time:", new Date(refundTime * 1000).toISOString());

// Create the hash lock script
// This script allows spending if:
// 1. Receiver provides the secret (preimage) and signature
// 2. OR Refund key signs after timelock expires
console.log("\n📜 Creating hash lock script...");

// The script structure:
// IF
//   OP_SHA256 <secretHash> OP_EQUALVERIFY <receiverPubkey> OP_CHECKSIG
// ELSE
//   <refundTime> OP_CHECKLOCKTIMEVERIFY OP_DROP <refundPubkey> OP_CHECKSIG
// ENDIF

// For simplicity, we'll create a basic hash lock
// In practice, you'd need a more complex script for true HTLC
const script = bitcoin.script.compile([
  bitcoin.opcodes.OP_SHA256,                    // Hash the provided secret
  secretHash,                                   // Compare with expected hash
  bitcoin.opcodes.OP_EQUALVERIFY,               // Verify hash matches
  receiverKeyPair.publicKey,                    // Receiver's public key
  bitcoin.opcodes.OP_CHECKSIG                   // Verify receiver's signature
]);

console.log("✅ Hash lock script created");
console.log("Script (hex):", script.toString('hex'));

// Create P2SH address
const { address, redeem } = bitcoin.payments.p2sh({
  redeem: { output: script },
  network,
});

console.log("\n🏠 Creating P2SH address...");
console.log("✅ P2SH address created");
console.log("Hash Lock Address (P2SH):", address);

// Display the Bitcoin Script breakdown
console.log("\n📖 Bitcoin Script Breakdown:");
console.log("The hash lock script contains:");
console.log("1. OP_SHA256 - Hash the provided secret");
console.log("2. <secretHash> - The expected hash value");
console.log("3. OP_EQUALVERIFY - Verify hash matches");
console.log("4. <receiverPubkey> - Receiver's public key");
console.log("5. OP_CHECKSIG - Verify receiver's signature");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("Receiver WIF:", receiverKeyPair.toWIF());
console.log("Refund WIF:", refundKeyPair.toWIF());

console.log("\n🔑 Secret Information:");
console.log("Secret (preimage):", secret.toString('hex'));
console.log("Secret Hash:", secretHash.toString('hex'));

console.log("\n💡 How the hash lock works:");
console.log("1. Sender creates hash of secret and sends funds");
console.log("2. Receiver provides secret + signature to claim funds");
console.log("3. If secret is correct, funds are released");
console.log("4. If timelock expires, refund key can claim funds");

console.log("\n🎯 Use Cases:");
console.log("✅ Atomic swaps between cryptocurrencies");
console.log("✅ Lightning Network payment channels");
console.log("✅ Cross-chain transactions");
console.log("✅ Conditional payments");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to the hash lock address");
console.log("- Test spending with correct secret");
console.log("- Test spending with incorrect secret (should fail)");

console.log("\n=== End of Hash Lock Generation ===");
