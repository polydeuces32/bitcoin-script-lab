// Bitcoin Script Learning Lab - Frontend JavaScript
// This provides a web interface for generating and testing Bitcoin Scripts

// Mock Bitcoin Script generation (in a real implementation, you'd use bitcoinjs-lib)
class BitcoinScriptLab {
    constructor() {
        this.currentScript = null;
        this.currentKeys = [];
    }

    // Generate different types of Bitcoin Scripts
    generateScript(type) {
        const scriptData = {
            multisig: this.generateMultisig(),
            timelock: this.generateTimelock(),
            escrow: this.generateEscrow(),
            hashlock: this.generateHashlock(),
            segwit: this.generateSegwit(),
            miniscript: this.generateMiniscript(),
            lightning: this.generateLightning()
        };

        return scriptData[type] || null;
    }

    generateMultisig() {
        // Generate mock data for 2-of-2 multisig
        const key1 = this.generateMockKey();
        const key2 = this.generateMockKey();
        const address = this.generateMockAddress();
        
        return {
            type: '2-of-2 Multisig',
            address: address,
            script: 'OP_2 <pubkey1> <pubkey2> OP_2 OP_CHECKMULTISIG',
            scriptHex: '5221' + key1.pubkey + '21' + key2.pubkey + '52ae',
            keys: [key1, key2],
            explanation: `
                <h6>Multisig Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_2</span> - Require 2 signatures</li>
                    <li><span class="opcode">&lt;pubkey1&gt;</span> - First public key (33 bytes)</li>
                    <li><span class="opcode">&lt;pubkey2&gt;</span> - Second public key (33 bytes)</li>
                    <li><span class="opcode">OP_2</span> - Total of 2 public keys</li>
                    <li><span class="opcode">OP_CHECKMULTISIG</span> - Verify signatures</li>
                </ol>
                <p><strong>Use Case:</strong> Shared custody and security. Both parties must sign to spend.</p>
            `
        };
    }

    generateTimelock() {
        const key = this.generateMockKey();
        const address = this.generateMockAddress();
        const lockTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now
        
        return {
            type: 'Timelock (CLTV)',
            address: address,
            script: `<locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey> OP_CHECKSIG`,
            scriptHex: '04' + lockTime.toString(16).padStart(8, '0') + 'b17521' + key.pubkey + 'ac',
            keys: [key],
            lockTime: lockTime,
            explanation: `
                <h6>Timelock Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">&lt;locktime&gt;</span> - Unix timestamp when funds can be spent</li>
                    <li><span class="opcode">OP_CHECKLOCKTIMEVERIFY</span> - Verify current time >= locktime</li>
                    <li><span class="opcode">OP_DROP</span> - Remove locktime from stack</li>
                    <li><span class="opcode">&lt;pubkey&gt;</span> - Public key that can spend</li>
                    <li><span class="opcode">OP_CHECKSIG</span> - Verify signature</li>
                </ol>
                <p><strong>Use Case:</strong> Time-based fund releases. Funds locked until ${new Date(lockTime * 1000).toLocaleString()}.</p>
            `
        };
    }

    generateEscrow() {
        const buyer = this.generateMockKey();
        const seller = this.generateMockKey();
        const arbitrator = this.generateMockKey();
        const address = this.generateMockAddress();
        
        return {
            type: 'Escrow (2-of-3)',
            address: address,
            script: 'OP_2 <buyer> <seller> <arbitrator> OP_3 OP_CHECKMULTISIG',
            scriptHex: '5221' + buyer.pubkey + '21' + seller.pubkey + '21' + arbitrator.pubkey + '53ae',
            keys: [buyer, seller, arbitrator],
            explanation: `
                <h6>Escrow Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_2</span> - Require 2 signatures</li>
                    <li><span class="opcode">&lt;buyer&gt;</span> - Buyer's public key</li>
                    <li><span class="opcode">&lt;seller&gt;</span> - Seller's public key</li>
                    <li><span class="opcode">&lt;arbitrator&gt;</span> - Arbitrator's public key</li>
                    <li><span class="opcode">OP_3</span> - Total of 3 public keys</li>
                    <li><span class="opcode">OP_CHECKMULTISIG</span> - Verify signatures</li>
                </ol>
                <p><strong>Use Case:</strong> Dispute resolution. Any 2 of 3 parties can spend (buyer+seller, buyer+arbitrator, seller+arbitrator).</p>
            `
        };
    }

    generateHashlock() {
        const receiver = this.generateMockKey();
        const refund = this.generateMockKey();
        const address = this.generateMockAddress();
        const secret = this.generateMockSecret();
        const secretHash = this.sha256(secret);
        
        return {
            type: 'Hash Lock (HTLC)',
            address: address,
            script: 'OP_SHA256 <hash> OP_EQUALVERIFY <pubkey> OP_CHECKSIG',
            scriptHex: 'a820' + secretHash + '88' + receiver.pubkey + 'ac',
            keys: [receiver, refund],
            secret: secret,
            secretHash: secretHash,
            explanation: `
                <h6>Hash Lock Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_SHA256</span> - Hash the provided secret</li>
                    <li><span class="opcode">&lt;hash&gt;</span> - Expected hash value</li>
                    <li><span class="opcode">OP_EQUALVERIFY</span> - Verify hash matches</li>
                    <li><span class="opcode">&lt;pubkey&gt;</span> - Receiver's public key</li>
                    <li><span class="opcode">OP_CHECKSIG</span> - Verify signature</li>
                </ol>
                <p><strong>Use Case:</strong> Atomic swaps and Lightning Network. Requires knowledge of secret to spend.</p>
                <p><strong>Secret:</strong> ${secret} (keep this secret!)</p>
            `
        };
    }

    generateSegwit() {
        const key = this.generateMockKey();
        const address = this.generateMockSegwitAddress();
        
        return {
            type: 'SegWit (P2WPKH)',
            address: address,
            script: 'OP_0 <pubkeyhash>',
            scriptHex: '0014' + this.hash160(key.pubkey),
            keys: [key],
            explanation: `
                <h6>SegWit Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_0</span> - Version 0 witness program</li>
                    <li><span class="opcode">&lt;pubkeyhash&gt;</span> - Hash of public key (20 bytes)</li>
                </ol>
                <p><strong>Witness:</strong> &lt;signature&gt; &lt;pubkey&gt;</p>
                <p><strong>Use Case:</strong> Modern single-signature wallets. More efficient and enables Lightning Network.</p>
            `
        };
    }

    generateMiniscript() {
        const alice = this.generateMockKey();
        const bob = this.generateMockKey();
        const charlie = this.generateMockKey();
        const address = this.generateMockAddress();
        
        return {
            type: 'Miniscript',
            address: address,
            script: 'or_b(pk(Alice), and_b(pk(Bob), pk(Charlie)))',
            scriptHex: '5221' + alice.pubkey + '21' + bob.pubkey + '21' + charlie.pubkey + '53ae',
            keys: [alice, bob, charlie],
            explanation: `
                <h6>Miniscript Breakdown:</h6>
                <ol>
                    <li><span class="opcode">or_b</span> - OR condition</li>
                    <li><span class="opcode">pk(Alice)</span> - Alice can spend alone</li>
                    <li><span class="opcode">and_b</span> - AND condition</li>
                    <li><span class="opcode">pk(Bob), pk(Charlie)</span> - Bob AND Charlie must both sign</li>
                </ol>
                <p><strong>Use Case:</strong> Composable spending conditions. Alice OR (Bob AND Charlie) can spend.</p>
            `
        };
    }

    generateLightning() {
        const alice = this.generateMockKey();
        const bob = this.generateMockKey();
        const aliceRevocation = this.generateMockKey();
        const bobRevocation = this.generateMockKey();
        const address = this.generateMockAddress();
        
        return {
            type: 'Lightning Network',
            address: address,
            script: 'OP_IF <revocationKey> OP_CHECKSIG OP_ELSE <delay> OP_CHECKSEQUENCEVERIFY OP_DROP <remoteKey> OP_CHECKSIG OP_ENDIF',
            scriptHex: '63' + aliceRevocation.pubkey + 'ac' + '67' + '900000' + 'b2' + '75' + '21' + bob.pubkey + 'ac' + '68',
            keys: [alice, bob, aliceRevocation, bobRevocation],
            explanation: `
                <h6>Lightning Network Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">&lt;revocationKey&gt;</span> - Immediate spend with revocation key</li>
                    <li><span class="opcode">OP_CHECKSIG</span> - Verify signature</li>
                    <li><span class="opcode">OP_ELSE</span> - Alternative execution path</li>
                    <li><span class="opcode">&lt;delay&gt;</span> - Time lock (144 blocks = 24 hours)</li>
                    <li><span class="opcode">OP_CHECKSEQUENCEVERIFY</span> - Verify time lock</li>
                    <li><span class="opcode">OP_DROP</span> - Remove delay from stack</li>
                    <li><span class="opcode">&lt;remoteKey&gt;</span> - Remote party's public key</li>
                    <li><span class="opcode">OP_CHECKSIG</span> - Verify signature</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Lightning Network payment channels for fast, cheap micropayments.</p>
            `
        };
    }

    // Helper methods
    generateMockKey() {
        const wif = 'c' + Math.random().toString(36).substr(2, 50);
        const pubkey = Math.random().toString(16).substr(2, 66);
        return { wif, pubkey };
    }

    generateMockAddress() {
        return '2' + Math.random().toString(36).substr(2, 33);
    }

    generateMockSegwitAddress() {
        return 'tb1' + Math.random().toString(36).substr(2, 39);
    }

    generateMockSecret() {
        return Math.random().toString(16).substr(2, 64);
    }

    sha256(input) {
        // Mock SHA256 - in real implementation, use crypto library
        return Math.random().toString(16).substr(2, 64);
    }

    hash160(input) {
        // Mock HASH160 - in real implementation, use crypto library
        return Math.random().toString(16).substr(2, 40);
    }
}

// Initialize the lab
const scriptLab = new BitcoinScriptLab();

// Frontend functions
function generateScript() {
    const scriptType = document.getElementById('script-type').value;
    const script = scriptLab.generateScript(scriptType);
    
    if (script) {
        // Store current script
        scriptLab.currentScript = script;
        scriptLab.currentKeys = script.keys;
        
        // Display script
        document.getElementById('script-content').innerHTML = `
            <div class="mb-3">
                <strong>Type:</strong> ${script.type}<br>
                <strong>Address:</strong> <span class="address-output">${script.address}</span><br>
                <strong>Script:</strong> <code>${script.script}</code><br>
                <strong>Script Hex:</strong> <code>${script.scriptHex}</code>
            </div>
            <div class="mb-3">
                <strong>Private Keys:</strong><br>
                ${script.keys.map((key, i) => `<div class="key-output">Key ${i + 1}: ${key.wif}</div>`).join('')}
            </div>
        `;
        
        // Display explanation
        document.getElementById('script-explanation').innerHTML = script.explanation;
        
        // Show outputs
        document.getElementById('script-output').style.display = 'block';
        document.getElementById('explanation-card').style.display = 'block';
        
        // Populate transaction builder
        document.getElementById('from-address').value = script.address;
        document.getElementById('private-keys').value = script.keys.map(k => k.wif).join('\n');
        
        // Notify testnet helper of new address
        if (window.testnetHelper) {
            window.testnetHelper.updateAddress(script.address);
        }
        
        // Dispatch event for testnet helper
        const event = new CustomEvent('scriptGenerated', {
            detail: {
                type: script.type,
                address: script.address,
                script: script.script,
                keys: script.keys
            }
        });
        document.dispatchEvent(event);
        
        // Show success notification
        showNotification(`Script generated! Address: ${script.address.substring(0, 20)}...`, 'success');
    }
}

function clearOutput() {
    document.getElementById('script-output').style.display = 'none';
    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('transaction-output').style.display = 'none';
    document.getElementById('from-address').value = '';
    document.getElementById('private-keys').value = '';
    scriptLab.currentScript = null;
    scriptLab.currentKeys = [];
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function buildTransaction() {
    const fromAddress = document.getElementById('from-address').value;
    const toAddress = document.getElementById('to-address').value;
    const amount = document.getElementById('amount').value;
    
    if (!fromAddress || !toAddress || !amount) {
        alert('Please fill in all transaction fields');
        return;
    }
    
    // Mock transaction building
    const tx = {
        version: '02000000',
        inputCount: '01',
        input: fromAddress + '00000000',
        outputCount: '02',
        output1: toAddress + amount.padStart(16, '0'),
        output2: fromAddress + '00000000',
        locktime: '00000000'
    };
    
    const txHex = tx.version + tx.inputCount + tx.input + tx.outputCount + tx.output1 + tx.output2 + tx.locktime;
    
    document.getElementById('transaction-content').innerHTML = `
        <div class="mb-3">
            <strong>From:</strong> ${fromAddress}<br>
            <strong>To:</strong> ${toAddress}<br>
            <strong>Amount:</strong> ${amount} satoshi<br>
            <strong>Transaction Hex:</strong> <code>${txHex}</code>
        </div>
    `;
    
    document.getElementById('transaction-output').style.display = 'block';
}

function signTransaction() {
    if (!scriptLab.currentScript) {
        alert('Please generate a script first');
        return;
    }
    
    const privateKeys = document.getElementById('private-keys').value.split('\n').filter(k => k.trim());
    
    if (privateKeys.length === 0) {
        alert('Please provide private keys');
        return;
    }
    
    // Mock transaction signing
    const signatures = privateKeys.map((key, i) => `Signature ${i + 1}: ${Math.random().toString(16).substr(2, 128)}`);
    
    document.getElementById('transaction-content').innerHTML += `
        <div class="mt-3">
            <strong>Signatures:</strong><br>
            ${signatures.map(sig => `<div class="key-output">${sig}</div>`).join('')}
        </div>
        <div class="mt-3">
            <strong>Status:</strong> <span class="text-success">Transaction signed and ready to broadcast</span><br>
            <strong>Next Step:</strong> Copy the transaction hex and broadcast it to testnet
        </div>
    `;
}

// AI Script Generator Functions
function generateAIScript() {
    const description = document.getElementById('ai-description').value.trim();
    
    if (!description) {
        alert('Please enter a description of the script you want to create');
        return;
    }
    
    // Show loading state
    const button = document.querySelector('button[onclick="generateAIScript()"]');
    const originalText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;
    
    // Simulate AI processing (in real implementation, this would call an AI service)
    setTimeout(() => {
        const result = aiScriptGenerator.generateScript(description);
        
        if (result.success) {
            displayAIScript(result);
        } else {
            displayAIError(result);
        }
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

function displayAIScript(result) {
    const output = document.getElementById('ai-script-output');
    const content = document.getElementById('ai-script-content');
    
    content.innerHTML = `
        <div class="mb-3">
            <strong>Script Type:</strong> ${result.scriptType.toUpperCase()}<br>
            <strong>Script:</strong> <code>${result.script.script}</code><br>
            <strong>Description:</strong> ${result.script.description}
        </div>
        <div class="mb-3">
            <strong>Explanation:</strong><br>
            ${result.explanation}
        </div>
        <div class="mb-3">
            <strong>Usage Instructions:</strong><br>
            <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 0.9rem;">${result.usage}</pre>
        </div>
        <div class="mb-3">
            <button class="btn btn-primary btn-sm" onclick="useAIScript('${result.scriptType}')">Use This Script</button>
            <button class="btn btn-secondary btn-sm" onclick="copyAIScript()">Copy Script</button>
        </div>
    `;
    
    output.style.display = 'block';
}

function displayAIError(result) {
    const output = document.getElementById('ai-script-output');
    const content = document.getElementById('ai-script-content');
    
    content.innerHTML = `
        <div class="alert alert-warning">
            <strong>Could not generate script:</strong> ${result.error}
        </div>
        <div class="mt-3">
            <strong>Try these examples:</strong>
            <ul>
                ${result.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        </div>
    `;
    
    output.style.display = 'block';
}

function clearAIScript() {
    document.getElementById('ai-description').value = '';
    document.getElementById('ai-script-output').style.display = 'none';
}

function useAIScript(scriptType) {
    // Set the script type in the main generator
    document.getElementById('script-type').value = scriptType;
    
    // Generate the script using the main generator
    generateScript();
    
    // Scroll to the main generator
    document.querySelector('.card-header').scrollIntoView({ behavior: 'smooth' });
}

function copyAIScript() {
    const scriptText = document.querySelector('#ai-script-content code').textContent;
    navigator.clipboard.writeText(scriptText).then(() => {
        alert('Script copied to clipboard!');
    });
}

function setAIScript(description) {
    document.getElementById('ai-description').value = description;
    // Auto-generate the script
    generateAIScript();
}

// Initialize the interface
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bitcoin Script Learning Lab initialized');
});
