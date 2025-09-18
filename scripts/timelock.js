// btc-script-lab/scripts/timelock.js
// Bitcoin Script Learning Lab - Timelock Example
// Demonstrates OP_CHECKLOCKTIMEVERIFY (CLTV) for time-based spending conditions

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: Timelock (CLTV) ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate a keypair for the timelock address
console.log("\n🔑 Generating keypair...");
const keyPair = bitcoin.ECPair.makeRandom({ network });
console.log("✅ KeyPair generated");

// Set a timelock (24 hours from now in Unix timestamp)
const currentTime = Math.floor(Date.now() / 1000);
const lockTime = currentTime + (24 * 60 * 60); // 24 hours from now

console.log("\n⏰ Setting timelock...");
console.log("Current time:", new Date(currentTime * 1000).toISOString());
console.log("Lock time:", new Date(lockTime * 1000).toISOString());
console.log("Lock time (Unix):", lockTime);

// Create a timelock script manually
// This demonstrates the raw Bitcoin Script opcodes
console.log("\n📜 Creating timelock script...");

// The script: <locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey> OP_CHECKSIG
const script = bitcoin.script.compile([
  bitcoin.script.number.encode(lockTime),  // Push locktime
  bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,  // Check if current time >= locktime
  bitcoin.opcodes.OP_DROP,                 // Remove locktime from stack
  keyPair.publicKey,                       // Push public key
  bitcoin.opcodes.OP_CHECKSIG              // Verify signature
]);

console.log("✅ Timelock script created");
console.log("Script (hex):", script.toString('hex'));

// Create P2SH address
const { address, redeem } = bitcoin.payments.p2sh({
  redeem: { output: script },
  network,
});

console.log("\n🏠 Creating P2SH address...");
console.log("✅ P2SH address created");
console.log("Timelock Address (P2SH):", address);

// Display the Bitcoin Script breakdown
console.log("\n📖 Bitcoin Script Breakdown:");
console.log("The timelock script contains:");
console.log("1. <locktime> - The Unix timestamp when funds can be spent");
console.log("2. OP_CHECKLOCKTIMEVERIFY - Verify current time >= locktime");
console.log("3. OP_DROP - Remove locktime from stack");
console.log("4. <pubkey> - The public key that can spend");
console.log("5. OP_CHECKSIG - Verify the signature");

console.log("\n🔐 Private Key (KEEP SECURE - TESTNET ONLY!):");
console.log("WIF:", keyPair.toWIF());

console.log("\n💡 How to spend from this address:");
console.log("1. Fund the address with testnet BTC");
console.log("2. Wait until the locktime has passed");
console.log("3. Create a transaction with nLockTime >= locktime");
console.log("4. Sign with the private key");
console.log("5. Include the timelock script in the transaction");

console.log("\n⚠️  Important Notes:");
console.log("- Funds are locked until the specified time");
console.log("- The transaction's nLockTime must be >= script locktime");
console.log("- This prevents premature spending");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to the timelock address");
console.log("- Try spending before locktime (should fail)");
console.log("- Wait and try spending after locktime (should succeed)");

console.log("\n=== End of Timelock Generation ===");
