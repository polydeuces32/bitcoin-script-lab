# Bitcoin Script Learning Lab

## 🎯 Goal
Learn Bitcoin Script through hands-on experimentation with real testnet transactions. Understand how Bitcoin's scripting language enables custom spending conditions, multisig wallets, timelocks, and more.

## 🛠️ Tools & Libraries
- **bitcoinjs-lib** - JavaScript Bitcoin library
- **Hiro's multisig repo** - Stacks-over-Bitcoin multisig tools
- **Testnet** - Safe environment for experimentation
- **Web Interface** - Transaction creation and signing

## 📚 What You'll Learn

### 1. Basic Bitcoin Script Concepts
- **P2SH (Pay-to-Script-Hash)** - How Bitcoin wraps complex scripts
- **Redeem Scripts** - The actual spending conditions
- **OpCodes** - Bitcoin Script instructions
- **Stack Operations** - How Bitcoin Script executes

### 2. Script Types & Use Cases
- **Multisig** - Multiple signatures required
- **Timelocks** - Time-based spending conditions
- **Escrow** - Dispute resolution mechanisms
- **Hash Locks** - Secret-based spending (HTLCs)

### 3. Real-World Applications
- **Custody Solutions** - Secure key management
- **Lightning Network** - Payment channels
- **Atomic Swaps** - Cross-chain transactions
- **Smart Contracts** - Programmable money

## 🚀 Getting Started

### 1. Generate Your First Script
```bash
# Basic 2-of-2 multisig
node scripts/multisig.js

# Timelock script
node scripts/timelock.js

# Escrow script
node scripts/escrow.js

# Hash lock script
node scripts/hashlock.js
```

### 2. Fund Your Scripts
- Get testnet coins from faucets (see `testnet/README.md`)
- Send coins to your generated addresses
- Monitor on testnet block explorers

### 3. Test Spending
- Use the web interface to create transactions
- Sign with your private keys
- Broadcast to testnet

## 📖 Script Examples

### Multisig Script
```
OP_2 <pubkey1> <pubkey2> OP_2 OP_CHECKMULTISIG
```
- Requires 2 signatures from 2 public keys
- Used for shared custody and security

### Timelock Script
```
<locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey> OP_CHECKSIG
```
- Funds locked until specified time
- Used for time-based releases and escrow

### Hash Lock Script
```
OP_SHA256 <hash> OP_EQUALVERIFY <pubkey> OP_CHECKSIG
```
- Requires knowledge of secret (preimage)
- Used for atomic swaps and Lightning Network

## 🔧 Advanced Topics

### Script Execution
1. **Input Script** - Provides data and signatures
2. **Output Script** - Defines spending conditions
3. **Execution** - Bitcoin validates the combination
4. **Result** - Transaction succeeds or fails

### Common OpCodes
- `OP_CHECKSIG` - Verify signature
- `OP_CHECKMULTISIG` - Verify multiple signatures
- `OP_CHECKLOCKTIMEVERIFY` - Check timelock
- `OP_SHA256` - Hash operation
- `OP_EQUALVERIFY` - Verify equality

### P2SH Benefits
- **Privacy** - Script hash hides spending conditions
- **Efficiency** - Smaller transaction sizes
- **Flexibility** - Complex scripts without revealing details

## 🧪 Experimentation Ideas

### Beginner
- Create different multisig configurations (2-of-3, 3-of-5)
- Experiment with timelock durations
- Test script validation with wrong signatures

### Intermediate
- Combine multiple conditions (multisig + timelock)
- Create custom escrow scenarios
- Build hash lock contracts

### Advanced
- Design your own script opcodes
- Create complex conditional logic
- Explore Lightning Network scripts

## 📁 Project Structure

```
btc-script-lab/
├── scripts/           # Bitcoin Script examples
│   ├── multisig.js    # 2-of-2 multisig
│   ├── timelock.js    # Time-based spending
│   ├── escrow.js      # Dispute resolution
│   └── hashlock.js    # Secret-based spending
├── multisig-stx-btc/  # Web interface for Stacks
├── testnet/           # Testnet guides and tools
└── notes.md           # This learning guide
```

## 🔗 Resources

### Documentation
- [Bitcoin Script Wiki](https://en.bitcoin.it/wiki/Script)
- [Bitcoin OpCodes Reference](https://en.bitcoin.it/wiki/Script#Opcodes)
- [P2SH Specification](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)

### Tools
- [Bitcoin Testnet Faucet](https://testnet-faucet.mempool.co/)
- [Testnet Block Explorer](https://blockstream.info/testnet/)
- [Bitcoin Script Debugger](https://bitcoin-script-debugger.visvirial.com/)

### Learning
- [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook) - Chapter 6: Transactions
- [Bitcoin Script Tutorial](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)
- [Lightning Network Scripts](https://github.com/lightning/bolts)

## 🎓 Next Steps

1. **Run the examples** - Start with `multisig.js`
2. **Fund your scripts** - Get testnet coins and send them
3. **Test spending** - Use the web interface to create transactions
4. **Experiment** - Try different script combinations
5. **Build** - Create your own custom scripts
6. **Explore** - Learn about Lightning Network and Layer 2

## 💡 Tips for Success

- **Start simple** - Begin with basic multisig
- **Test everything** - Use testnet for all experiments
- **Read the code** - Understand how scripts are constructed
- **Experiment freely** - Testnet coins have no value
- **Document your learning** - Keep notes on what you discover

Happy scripting! 🚀

