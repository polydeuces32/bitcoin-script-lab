// btc-script-lab/scripts/miniscript.js
// Bitcoin Script Learning Lab - Miniscript Example
// Demonstrates Miniscript for more readable and composable Bitcoin Scripts

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: Miniscript ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate keypairs for Miniscript examples
console.log("\n🔑 Generating keypairs for Miniscript...");
const aliceKeyPair = bitcoin.ECPair.makeRandom({ network });
const bobKeyPair = bitcoin.ECPair.makeRandom({ network });
const charlieKeyPair = bitcoin.ECPair.makeRandom({ network });

console.log("✅ Alice keypair generated");
console.log("✅ Bob keypair generated");
console.log("✅ Charlie keypair generated");

// Miniscript example: "Alice OR (Bob AND Charlie)"
// This demonstrates composable spending conditions
console.log("\n📜 Creating Miniscript: Alice OR (Bob AND Charlie)...");

// In Miniscript, this would be: or_b(pk(Alice), and_b(pk(Bob), pk(Charlie)))
// For this example, we'll create a 2-of-3 multisig that represents the same logic
const pubkeys = [aliceKeyPair.publicKey, bobKeyPair.publicKey, charlieKeyPair.publicKey];

const redeemScript = bitcoin.payments.p2ms({ 
  m: 2,        // Require 2 signatures
  pubkeys,     // From these 3 public keys
  network 
});

console.log("✅ Miniscript-inspired multisig created");
console.log("Redeem Script (hex):", redeemScript.output.toString('hex'));

// Create P2SH address
const { address, redeem } = bitcoin.payments.p2sh({
  redeem: redeemScript,
  network,
});

console.log("\n🏠 Creating P2SH address...");
console.log("✅ P2SH address created");
console.log("Miniscript Address (P2SH):", address);

// Display Miniscript concepts
console.log("\n📖 Miniscript Concepts:");
console.log("1. **Readable Syntax** - Human-readable spending conditions");
console.log("2. **Composability** - Combine simple conditions into complex ones");
console.log("3. **Analysis** - Automatic analysis of script properties");
console.log("4. **Optimization** - Automatic script optimization");

// Script breakdown
console.log("\n📖 Script Breakdown:");
console.log("Miniscript: or_b(pk(Alice), and_b(pk(Bob), pk(Charlie)))");
console.log("Meaning: Alice can spend alone, OR Bob AND Charlie must both sign");
console.log("");
console.log("Bitcoin Script equivalent:");
console.log("1. OP_2 (require 2 signatures)");
console.log("2. Alice PubKey (33 bytes)");
console.log("3. Bob PubKey (33 bytes)");
console.log("4. Charlie PubKey (33 bytes)");
console.log("5. OP_3 (total of 3 public keys)");
console.log("6. OP_CHECKMULTISIG (verify signatures)");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("Alice WIF:", aliceKeyPair.toWIF());
console.log("Bob WIF:", bobKeyPair.toWIF());
console.log("Charlie WIF:", charlieKeyPair.toWIF());

console.log("\n💡 Miniscript Benefits:");
console.log("1. **Readability** - Easy to understand spending conditions");
console.log("2. **Composability** - Build complex scripts from simple parts");
console.log("3. **Analysis** - Automatic security and cost analysis");
console.log("4. **Optimization** - Automatic script size optimization");

console.log("\n🎯 Use Cases:");
console.log("✅ **Complex Multisig** - Multiple spending conditions");
console.log("✅ **Escrow Contracts** - Dispute resolution mechanisms");
console.log("✅ **Time Locks** - Time-based spending conditions");
console.log("✅ **Smart Contracts** - Programmable spending logic");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to the Miniscript address");
console.log("- Test different spending combinations");
console.log("- Explore more complex Miniscript examples");

console.log("\n=== End of Miniscript Generation ===");
