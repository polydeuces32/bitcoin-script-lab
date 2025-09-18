# Bitcoin Testnet Guide

This guide helps you get started with Bitcoin Script experimentation on testnet.

## What is Testnet?

Bitcoin testnet is a separate Bitcoin network used for testing and development. It uses testnet coins that have no real value, making it safe to experiment with Bitcoin Script without financial risk.

## Getting Testnet Coins

### 1. Get a Testnet Wallet

You can use any Bitcoin wallet that supports testnet:
- **Electrum** (recommended for beginners)
- **Bitcoin Core** (full node)
- **Online wallets** (for quick testing)

### 2. Get Testnet Coins

#### Option A: Testnet Faucets (Easiest)
- **Bitcoin Testnet Faucet**: https://testnet-faucet.mempool.co/
- **Coinfaucet**: https://coinfaucet.eu/en/btc-testnet/
- **Testnet Faucet**: https://testnet.help/en/btcfaucet/testnet

#### Option B: Bitcoin Core Testnet
1. Install Bitcoin Core
2. Run with `-testnet` flag
3. Generate address: `bitcoin-cli -testnet getnewaddress`
4. Use faucets to send coins to your address

### 3. Verify Your Coins

Check your balance:
```bash
# If using Bitcoin Core
bitcoin-cli -testnet getbalance

# If using Electrum
# Check balance in the wallet interface
```

## Using This Lab

### 1. Generate Scripts

Run the example scripts to create different Bitcoin Script addresses:

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

1. Copy the generated address from the script output
2. Send testnet coins to that address using your wallet
3. Wait for confirmation (usually 1-6 blocks)

### 3. Test Spending

Use the web interface (`multisig-stx-btc/src/index.html`) to:
1. Create transactions spending from your script addresses
2. Sign transactions with the private keys
3. Broadcast transactions to testnet

## Testnet Block Explorers

Monitor your transactions:
- **Blockstream Testnet**: https://blockstream.info/testnet/
- **BlockCypher Testnet**: https://live.blockcypher.com/btc-testnet/
- **Mempool Testnet**: https://mempool.space/testnet/

## Common Testnet Addresses

- **P2PKH**: Start with `m` or `n` (testnet)
- **P2SH**: Start with `2` (testnet)
- **Bech32**: Start with `tb1` (testnet)

## Safety Notes

⚠️ **Important**: 
- Never use testnet private keys on mainnet
- Testnet coins have no value
- Always verify you're on testnet before sending real Bitcoin

## Troubleshooting

### "Insufficient funds" error
- Make sure you've sent enough testnet coins
- Wait for transaction confirmation
- Check the address balance on a block explorer

### "Script validation failed"
- Verify you're using the correct private keys
- Check that the script matches the address
- Ensure you're following the spending conditions

### "Transaction rejected"
- Check the transaction fee
- Verify the script is valid
- Make sure all required signatures are provided

## Learning Resources

- [Bitcoin Script Documentation](https://en.bitcoin.it/wiki/Script)
- [Bitcoin Opcodes Reference](https://en.bitcoin.it/wiki/Script#Opcodes)
- [P2SH Specification](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)
- [Multisig Specification](https://github.com/bitcoin/bips/blob/master/bip-0011.mediawiki)

## Next Steps

1. Start with the basic multisig script
2. Experiment with different script types
3. Try creating your own custom scripts
4. Learn about more advanced Bitcoin Script features
5. Explore Lightning Network and other Layer 2 solutions

Happy scripting! 🚀
