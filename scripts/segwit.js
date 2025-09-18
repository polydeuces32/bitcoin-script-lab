// btc-script-lab/scripts/segwit.js
// Bitcoin Script Learning Lab - SegWit Example
// Demonstrates P2WPKH (Pay-to-Witness-Public-Key-Hash) and P2WSH (Pay-to-Witness-Script-Hash)

const bitcoin = require('bitcoinjs-lib');

console.log("=== Bitcoin Script Lab: SegWit (P2WPKH & P2WSH) ===\n");

// Use testnet for safe experimentation
const network = bitcoin.networks.testnet;
console.log("🌐 Network: Bitcoin Testnet");

// Generate keypairs for SegWit examples
console.log("\n🔑 Generating keypairs for SegWit...");
const keyPair = bitcoin.ECPair.makeRandom({ network });
const keyPair1 = bitcoin.ECPair.makeRandom({ network });
const keyPair2 = bitcoin.ECPair.makeRandom({ network });

console.log("✅ KeyPair generated for P2WPKH");
console.log("✅ KeyPairs generated for P2WSH multisig");

// P2WPKH (Pay-to-Witness-Public-Key-Hash)
console.log("\n📜 Creating P2WPKH address...");
const p2wpkh = bitcoin.payments.p2wpkh({
  pubkey: keyPair.publicKey,
  network
});

console.log("✅ P2WPKH address created");
console.log("P2WPKH Address (Bech32):", p2wpkh.address);

// P2WSH (Pay-to-Witness-Script-Hash) - Multisig
console.log("\n📜 Creating P2WSH multisig address...");
const pubkeys = [keyPair1.publicKey, keyPair2.publicKey];
const redeemScript = bitcoin.payments.p2ms({ 
  m: 2, 
  pubkeys, 
  network 
});

const p2wsh = bitcoin.payments.p2wsh({
  redeem: redeemScript,
  network
});

console.log("✅ P2WSH address created");
console.log("P2WSH Address (Bech32):", p2wsh.address);

// Display SegWit benefits
console.log("\n📖 SegWit Benefits:");
console.log("1. **Witness Data Separation** - Signatures stored separately from transaction data");
console.log("2. **Reduced Transaction Size** - Lower fees for complex scripts");
console.log("3. **Malleability Fix** - Prevents transaction ID malleability");
console.log("4. **Future-Proofing** - Enables Lightning Network and other Layer 2 solutions");

// Script breakdown
console.log("\n📖 Script Breakdown:");
console.log("P2WPKH Script:");
console.log("- OP_0 <pubkeyhash> (witness program)");
console.log("- Witness: <signature> <pubkey>");
console.log("");
console.log("P2WSH Script:");
console.log("- OP_0 <scripthash> (witness program)");
console.log("- Witness: <signature1> <signature2> <redeemscript>");

console.log("\n🔐 Private Keys (KEEP SECURE - TESTNET ONLY!):");
console.log("P2WPKH WIF:", keyPair.toWIF());
console.log("P2WSH Key1 WIF:", keyPair1.toWIF());
console.log("P2WSH Key2 WIF:", keyPair2.toWIF());

console.log("\n💡 How SegWit works:");
console.log("1. **P2WPKH** - Simple single-signature with witness data");
console.log("2. **P2WSH** - Complex scripts with witness data");
console.log("3. **Witness** - Signatures stored in separate witness field");
console.log("4. **Validation** - Same security as legacy scripts");

console.log("\n🎯 Use Cases:");
console.log("✅ **P2WPKH** - Modern single-signature wallets");
console.log("✅ **P2WSH** - Complex multisig and smart contracts");
console.log("✅ **Lightning Network** - Payment channels");
console.log("✅ **Lower Fees** - More efficient transaction structure");

console.log("\n🧪 Next Steps:");
console.log("- Send testnet BTC to SegWit addresses");
console.log("- Compare transaction sizes with legacy scripts");
console.log("- Test spending with witness data");

console.log("\n=== End of SegWit Generation ===");
