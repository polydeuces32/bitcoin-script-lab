// Bitcoin Script Learning Lab - AI Script Generator
// Simulates AI-powered script generation from natural language descriptions

class AIScriptGenerator {
    constructor() {
        this.scriptTemplates = this.initializeScriptTemplates();
        this.keywords = this.initializeKeywords();
    }

    initializeScriptTemplates() {
        return {
            // Basic Scripts
            'multisig': {
                patterns: ['multisig', 'multi-sig', 'multi signature', 'shared custody', 'joint custody'],
                generate: (description) => this.generateMultisigScript(description)
            },
            'timelock': {
                patterns: ['timelock', 'time lock', 'lock for', 'unlock after', 'wait for'],
                generate: (description) => this.generateTimelockScript(description)
            },
            'escrow': {
                patterns: ['escrow', 'dispute resolution', 'arbitration', 'mediator'],
                generate: (description) => this.generateEscrowScript(description)
            },
            'hashlock': {
                patterns: ['hash lock', 'atomic swap', 'secret', 'preimage', 'htlc'],
                generate: (description) => this.generateHashlockScript(description)
            },
            'lightning': {
                patterns: ['lightning', 'payment channel', 'off-chain', 'micropayment'],
                generate: (description) => this.generateLightningScript(description)
            },
            
            // Advanced Scripts
            'vault': {
                patterns: ['vault', 'recovery', 'backup', 'emergency', 'safety'],
                generate: (description) => this.generateVaultScript(description)
            },
            'dao': {
                patterns: ['dao', 'voting', 'governance', 'proposal', 'consensus'],
                generate: (description) => this.generateDAOScript(description)
            },
            'insurance': {
                patterns: ['insurance', 'payout', 'claim', 'coverage', 'policy'],
                generate: (description) => this.generateInsuranceScript(description)
            },
            'inheritance': {
                patterns: ['inheritance', 'will', 'estate', 'heir', 'beneficiary'],
                generate: (description) => this.generateInheritanceScript(description)
            },
            'subscription': {
                patterns: ['subscription', 'recurring', 'monthly', 'annual', 'renewal'],
                generate: (description) => this.generateSubscriptionScript(description)
            },
            'vesting': {
                patterns: ['vesting', 'vest', 'schedule', 'gradual', 'unlock over time'],
                generate: (description) => this.generateVestingScript(description)
            },
            'conditional': {
                patterns: ['conditional', 'if then', 'depends on', 'based on', 'when'],
                generate: (description) => this.generateConditionalScript(description)
            }
        };
    }

    initializeKeywords() {
        return {
            'time_units': {
                'seconds': 1,
                'minutes': 60,
                'hours': 3600,
                'days': 86400,
                'weeks': 604800,
                'months': 2592000,
                'years': 31536000
            },
            'signature_counts': {
                '1-of-2': { m: 1, n: 2 },
                '2-of-2': { m: 2, n: 2 },
                '2-of-3': { m: 2, n: 3 },
                '3-of-5': { m: 3, n: 5 },
                '4-of-7': { m: 4, n: 7 }
            }
        };
    }

    generateScript(description) {
        const normalizedDescription = description.toLowerCase();
        
        // Find matching script type
        for (const [scriptType, template] of Object.entries(this.scriptTemplates)) {
            for (const pattern of template.patterns) {
                if (normalizedDescription.includes(pattern)) {
                    try {
                        const result = template.generate(description);
                        return {
                            success: true,
                            scriptType: scriptType,
                            script: result.script,
                            explanation: result.explanation,
                            usage: result.usage
                        };
                    } catch (error) {
                        return {
                            success: false,
                            error: `Error generating ${scriptType} script: ${error.message}`,
                            suggestions: this.getSuggestions(scriptType)
                        };
                    }
                }
            }
        }
        
        return {
            success: false,
            error: "Could not understand the script description. Please try a different approach.",
            suggestions: this.getGeneralSuggestions()
        };
    }

    generateMultisigScript(description) {
        const sigCount = this.extractSignatureCount(description);
        const keys = this.generateMockKeys(sigCount.n);
        
        return {
            script: {
                script: `OP_${sigCount.m} ${keys.map(k => k.pubkey).join(' ')} OP_${sigCount.n} OP_CHECKMULTISIG`,
                description: `${sigCount.m}-of-${sigCount.n} multisig for shared custody`
            },
            explanation: `
                <h6>Multisig Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_${sigCount.m}</span> - Require ${sigCount.m} signatures</li>
                    <li><span class="opcode">${keys.map(k => k.pubkey).join(' ')}</span> - Public keys of ${sigCount.n} participants</li>
                    <li><span class="opcode">OP_${sigCount.n}</span> - Total number of public keys</li>
                    <li><span class="opcode">OP_CHECKMULTISIG</span> - Verify the signatures</li>
                </ol>
                <p><strong>Use Case:</strong> Shared custody where ${sigCount.m} out of ${sigCount.n} participants must sign to spend funds.</p>
            `,
            usage: `# Generate ${sigCount.m}-of-${sigCount.n} multisig
# 1. Create ${sigCount.n} keypairs
# 2. Use the script above in a P2SH transaction
# 3. To spend: provide ${sigCount.m} valid signatures
# 4. Include the redeem script in the transaction`
        };
    }

    generateTimelockScript(description) {
        const timeValue = this.extractTimeValue(description);
        const key = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `<${timeValue}> OP_CHECKLOCKTIMEVERIFY OP_DROP ${key.pubkey} OP_CHECKSIG`,
                description: `Timelock script that locks funds for ${timeValue} seconds`
            },
            explanation: `
                <h6>Timelock Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">&lt;${timeValue}&gt;</span> - Lock time value (${timeValue} seconds)</li>
                    <li><span class="opcode">OP_CHECKLOCKTIMEVERIFY</span> - Verify current time >= lock time</li>
                    <li><span class="opcode">OP_DROP</span> - Remove lock time from stack</li>
                    <li><span class="opcode">${key.pubkey}</span> - Public key for spending</li>
                    <li><span class="opcode">OP_CHECKSIG</span> - Verify signature</li>
                </ol>
                <p><strong>Use Case:</strong> Time-based spending where funds are locked until a specific time.</p>
            `,
            usage: `# Create timelock script
# 1. Set lock time to ${timeValue} seconds from now
# 2. Use the script above in a P2SH transaction
# 3. To spend: wait until lock time expires, then provide signature
# 4. Include the redeem script in the transaction`
        };
    }

    generateEscrowScript(description) {
        const alice = this.generateMockKeys(1)[0];
        const bob = this.generateMockKeys(1)[0];
        const mediator = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${alice.pubkey} OP_CHECKSIG OP_ELSE OP_2 ${bob.pubkey} ${mediator.pubkey} OP_2 OP_CHECKMULTISIG OP_ENDIF`,
                description: `Escrow script with dispute resolution (Alice OR Bob+Mediator)`
            },
            explanation: `
                <h6>Escrow Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${alice.pubkey} OP_CHECKSIG</span> - Alice can spend alone (normal case)</li>
                    <li><span class="opcode">OP_ELSE</span> - Alternative path</li>
                    <li><span class="opcode">OP_2 ${bob.pubkey} ${mediator.pubkey} OP_2 OP_CHECKMULTISIG</span> - Bob + Mediator must both sign (dispute case)</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Escrow where Alice can spend normally, but disputes require Bob + Mediator consensus.</p>
            `,
            usage: `# Create escrow script
# 1. Alice, Bob, and Mediator each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Normal case: Alice signs and spends
# 4. Dispute case: Bob + Mediator both sign to spend
# 5. Include the redeem script in the transaction`
        };
    }

    generateHashlockScript(description) {
        const alice = this.generateMockKeys(1)[0];
        const bob = this.generateMockKeys(1)[0];
        const secret = this.generateMockSecret();
        const hash = this.generateMockHash(secret);
        
        return {
            script: {
                script: `OP_IF ${alice.pubkey} OP_CHECKSIG OP_ELSE ${hash} OP_SHA256 OP_EQUAL OP_IF ${bob.pubkey} OP_CHECKSIG OP_ENDIF OP_ENDIF`,
                description: `Hash lock script for atomic swaps (Alice OR Bob with secret)`
            },
            explanation: `
                <h6>Hash Lock Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - First conditional</li>
                    <li><span class="opcode">${alice.pubkey} OP_CHECKSIG</span> - Alice can spend (normal case)</li>
                    <li><span class="opcode">OP_ELSE</span> - Alternative path</li>
                    <li><span class="opcode">${hash} OP_SHA256 OP_EQUAL</span> - Check if provided secret hashes to ${hash}</li>
                    <li><span class="opcode">OP_IF ${bob.pubkey} OP_CHECKSIG OP_ENDIF</span> - If secret is correct, Bob can spend</li>
                    <li><span class="opcode">OP_ENDIF</span> - End first conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Atomic swaps where Alice can spend normally, or Bob can spend with the correct secret.</p>
            `,
            usage: `# Create hash lock script
# 1. Alice and Bob each have a keypair
# 2. Secret: ${secret} (hashes to ${hash})
# 3. Use the script above in a P2SH transaction
# 4. Alice can spend normally, or Bob can spend with secret
# 5. Include the redeem script in the transaction`
        };
    }

    generateLightningScript(description) {
        const alice = this.generateMockKeys(1)[0];
        const bob = this.generateMockKeys(1)[0];
        const aliceRevocation = this.generateMockKeys(1)[0];
        const bobRevocation = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${aliceRevocation.pubkey} OP_CHECKSIG OP_ELSE 144 OP_CHECKSEQUENCEVERIFY OP_DROP ${bob.pubkey} OP_CHECKSIG OP_ENDIF`,
                description: `Lightning Network payment channel script with penalty mechanism`
            },
            explanation: `
                <h6>Lightning Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${aliceRevocation.pubkey} OP_CHECKSIG</span> - Alice can spend with revocation key (penalty)</li>
                    <li><span class="opcode">OP_ELSE</span> - Alternative path</li>
                    <li><span class="opcode">144 OP_CHECKSEQUENCEVERIFY OP_DROP</span> - Wait 144 blocks (24 hours)</li>
                    <li><span class="opcode">${bob.pubkey} OP_CHECKSIG</span> - Bob can spend after delay</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Lightning Network payment channels for fast, cheap micropayments with penalty for cheating.</p>
            `,
            usage: `# Create Lightning payment channel
# 1. Alice and Bob each have a keypair + revocation key
# 2. Use the script above in a P2SH transaction
# 3. Alice can spend immediately with revocation key (penalty)
# 4. Bob can spend after 144 blocks (24 hours)
# 5. Include the redeem script in the transaction`
        };
    }

    generateVaultScript(description) {
        const user = this.generateMockKeys(1)[0];
        const recovery = this.generateMockKeys(1)[0];
        const emergency = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${user.pubkey} OP_CHECKSIG OP_ELSE 1000 OP_CHECKLOCKTIMEVERIFY OP_DROP ${recovery.pubkey} OP_CHECKSIG OP_ELSE 2000 OP_CHECKLOCKTIMEVERIFY OP_DROP ${emergency.pubkey} OP_CHECKSIG OP_ENDIF OP_ENDIF`,
                description: `Vault script with recovery and emergency mechanisms`
            },
            explanation: `
                <h6>Vault Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - First conditional</li>
                    <li><span class="opcode">${user.pubkey} OP_CHECKSIG</span> - User can spend immediately</li>
                    <li><span class="opcode">OP_ELSE</span> - Recovery path</li>
                    <li><span class="opcode">1000 OP_CHECKLOCKTIMEVERIFY OP_DROP</span> - Wait 1000 seconds</li>
                    <li><span class="opcode">${recovery.pubkey} OP_CHECKSIG</span> - Recovery key can spend</li>
                    <li><span class="opcode">OP_ELSE</span> - Emergency path</li>
                    <li><span class="opcode">2000 OP_CHECKLOCKTIMEVERIFY OP_DROP</span> - Wait 2000 seconds</li>
                    <li><span class="opcode">${emergency.pubkey} OP_CHECKSIG</span> - Emergency key can spend</li>
                    <li><span class="opcode">OP_ENDIF OP_ENDIF</span> - End conditionals</li>
                </ol>
                <p><strong>Use Case:</strong> Vault with multiple recovery mechanisms for enhanced security.</p>
            `,
            usage: `# Create vault script
# 1. User, Recovery, and Emergency each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. User can spend immediately
# 4. Recovery can spend after 1000 seconds
# 5. Emergency can spend after 2000 seconds
# 6. Include the redeem script in the transaction`
        };
    }

    generateDAOScript(description) {
        const proposer = this.generateMockKeys(1)[0];
        const voter1 = this.generateMockKeys(1)[0];
        const voter2 = this.generateMockKeys(1)[0];
        const voter3 = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${proposer.pubkey} OP_CHECKSIG OP_ELSE OP_2 ${voter1.pubkey} ${voter2.pubkey} ${voter3.pubkey} OP_3 OP_CHECKMULTISIG OP_ENDIF`,
                description: `DAO voting script (Proposer OR 2-of-3 voters)`
            },
            explanation: `
                <h6>DAO Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${proposer.pubkey} OP_CHECKSIG</span> - Proposer can spend (proposal execution)</li>
                    <li><span class="opcode">OP_ELSE</span> - Voting path</li>
                    <li><span class="opcode">OP_2 ${voter1.pubkey} ${voter2.pubkey} ${voter3.pubkey} OP_3 OP_CHECKMULTISIG</span> - 2-of-3 voters must agree</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> DAO governance where proposer can execute or 2-of-3 voters can override.</p>
            `,
            usage: `# Create DAO voting script
# 1. Proposer and 3 voters each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Proposer can spend (execute proposal)
# 4. 2-of-3 voters can spend (override proposal)
# 5. Include the redeem script in the transaction`
        };
    }

    generateInsuranceScript(description) {
        const policyholder = this.generateMockKeys(1)[0];
        const insurer = this.generateMockKeys(1)[0];
        const arbitrator = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${policyholder.pubkey} OP_CHECKSIG OP_ELSE OP_2 ${insurer.pubkey} ${arbitrator.pubkey} OP_2 OP_CHECKMULTISIG OP_ENDIF`,
                description: `Insurance payout script (Policyholder OR Insurer+Arbitrator)`
            },
            explanation: `
                <h6>Insurance Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${policyholder.pubkey} OP_CHECKSIG</span> - Policyholder can spend (claim payout)</li>
                    <li><span class="opcode">OP_ELSE</span> - Dispute path</li>
                    <li><span class="opcode">OP_2 ${insurer.pubkey} ${arbitrator.pubkey} OP_2 OP_CHECKMULTISIG</span> - Insurer + Arbitrator must agree</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Insurance where policyholder can claim or insurer+arbitrator can dispute.</p>
            `,
            usage: `# Create insurance script
# 1. Policyholder, Insurer, and Arbitrator each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Policyholder can spend (claim payout)
# 4. Insurer + Arbitrator can spend (dispute claim)
# 5. Include the redeem script in the transaction`
        };
    }

    generateInheritanceScript(description) {
        const heir = this.generateMockKeys(1)[0];
        const executor = this.generateMockKeys(1)[0];
        const witness = this.generateMockKeys(1)[0];
        
        return {
            script: {
                script: `OP_IF ${heir.pubkey} OP_CHECKSIG OP_ELSE OP_2 ${executor.pubkey} ${witness.pubkey} OP_2 OP_CHECKMULTISIG OP_ENDIF`,
                description: `Inheritance script (Heir OR Executor+Witness)`
            },
            explanation: `
                <h6>Inheritance Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${heir.pubkey} OP_CHECKSIG</span> - Heir can spend (normal inheritance)</li>
                    <li><span class="opcode">OP_ELSE</span> - Executor path</li>
                    <li><span class="opcode">OP_2 ${executor.pubkey} ${witness.pubkey} OP_2 OP_CHECKMULTISIG</span> - Executor + Witness must agree</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Inheritance where heir can spend or executor+witness can distribute.</p>
            `,
            usage: `# Create inheritance script
# 1. Heir, Executor, and Witness each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Heir can spend (normal inheritance)
# 4. Executor + Witness can spend (distribution)
# 5. Include the redeem script in the transaction`
        };
    }

    generateSubscriptionScript(description) {
        const subscriber = this.generateMockKeys(1)[0];
        const provider = this.generateMockKeys(1)[0];
        const timeLock = this.extractTimeValue(description) || 2592000; // 30 days default
        
        return {
            script: {
                script: `OP_IF ${subscriber.pubkey} OP_CHECKSIG OP_ELSE ${timeLock} OP_CHECKLOCKTIMEVERIFY OP_DROP ${provider.pubkey} OP_CHECKSIG OP_ENDIF`,
                description: `Subscription payment script (Subscriber OR Provider after ${timeLock} seconds)`
            },
            explanation: `
                <h6>Subscription Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${subscriber.pubkey} OP_CHECKSIG</span> - Subscriber can spend (cancel subscription)</li>
                    <li><span class="opcode">OP_ELSE</span> - Provider path</li>
                    <li><span class="opcode">${timeLock} OP_CHECKLOCKTIMEVERIFY OP_DROP</span> - Wait ${timeLock} seconds</li>
                    <li><span class="opcode">${provider.pubkey} OP_CHECKSIG</span> - Provider can spend after delay</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Subscription where subscriber can cancel or provider can collect after period.</p>
            `,
            usage: `# Create subscription script
# 1. Subscriber and Provider each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Subscriber can spend (cancel subscription)
# 4. Provider can spend after ${timeLock} seconds
# 5. Include the redeem script in the transaction`
        };
    }

    generateVestingScript(description) {
        const employee = this.generateMockKeys(1)[0];
        const employer = this.generateMockKeys(1)[0];
        const vestingPeriod = this.extractTimeValue(description) || 31536000; // 1 year default
        
        return {
            script: {
                script: `OP_IF ${employee.pubkey} OP_CHECKSIG OP_ELSE ${vestingPeriod} OP_CHECKLOCKTIMEVERIFY OP_DROP ${employer.pubkey} OP_CHECKSIG OP_ENDIF`,
                description: `Vesting script (Employee OR Employer after ${vestingPeriod} seconds)`
            },
            explanation: `
                <h6>Vesting Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${employee.pubkey} OP_CHECKSIG</span> - Employee can spend (vested shares)</li>
                    <li><span class="opcode">OP_ELSE</span> - Employer path</li>
                    <li><span class="opcode">${vestingPeriod} OP_CHECKLOCKTIMEVERIFY OP_DROP</span> - Wait ${vestingPeriod} seconds</li>
                    <li><span class="opcode">${employer.pubkey} OP_CHECKSIG</span> - Employer can spend after delay</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Employee vesting where employee can claim or employer can recover after period.</p>
            `,
            usage: `# Create vesting script
# 1. Employee and Employer each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Employee can spend (vested shares)
# 4. Employer can spend after ${vestingPeriod} seconds
# 5. Include the redeem script in the transaction`
        };
    }

    generateConditionalScript(description) {
        const alice = this.generateMockKeys(1)[0];
        const bob = this.generateMockKeys(1)[0];
        const condition = this.extractCondition(description);
        
        return {
            script: {
                script: `OP_IF ${alice.pubkey} OP_CHECKSIG OP_ELSE ${bob.pubkey} OP_CHECKSIG OP_ENDIF`,
                description: `Conditional payment script (Alice OR Bob based on ${condition})`
            },
            explanation: `
                <h6>Conditional Script Breakdown:</h6>
                <ol>
                    <li><span class="opcode">OP_IF</span> - Conditional execution</li>
                    <li><span class="opcode">${alice.pubkey} OP_CHECKSIG</span> - Alice can spend (condition met)</li>
                    <li><span class="opcode">OP_ELSE</span> - Alternative path</li>
                    <li><span class="opcode">${bob.pubkey} OP_CHECKSIG</span> - Bob can spend (condition not met)</li>
                    <li><span class="opcode">OP_ENDIF</span> - End conditional</li>
                </ol>
                <p><strong>Use Case:</strong> Conditional payment where Alice or Bob can spend based on external conditions.</p>
            `,
            usage: `# Create conditional script
# 1. Alice and Bob each have a keypair
# 2. Use the script above in a P2SH transaction
# 3. Alice can spend if condition is met
# 4. Bob can spend if condition is not met
# 5. Include the redeem script in the transaction`
        };
    }

    // Helper methods
    extractSignatureCount(description) {
        const text = description.toLowerCase();
        for (const [pattern, config] of Object.entries(this.keywords.signature_counts)) {
            if (text.includes(pattern)) {
                return config;
            }
        }
        return { m: 2, n: 3 }; // Default to 2-of-3
    }

    extractTimeValue(description) {
        const text = description.toLowerCase();
        const timeMatch = text.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?/);
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2];
            return value * this.keywords.time_units[unit];
        }
        return 86400; // Default to 1 day
    }

    extractCondition(description) {
        const text = description.toLowerCase();
        if (text.includes('price')) return 'price condition';
        if (text.includes('time')) return 'time condition';
        if (text.includes('event')) return 'event condition';
        return 'external condition';
    }

    generateMockKeys(count) {
        const keys = [];
        for (let i = 0; i < count; i++) {
            keys.push({
                pubkey: Math.random().toString(16).substr(2, 66),
                wif: 'c' + Math.random().toString(36).substr(2, 50)
            });
        }
        return keys;
    }

    generateMockSecret() {
        return Math.random().toString(16).substr(2, 32);
    }

    generateMockHash(secret) {
        return 'a' + Math.random().toString(16).substr(2, 63);
    }

    getSuggestions(scriptType) {
        const suggestions = {
            'multisig': [
                'Try: "Create a 2-of-3 multisig for shared custody"',
                'Try: "Make a 3-of-5 multisig for company funds"',
                'Try: "Create a 1-of-2 multisig for backup access"'
            ],
            'timelock': [
                'Try: "Make a timelock script that locks funds for 24 hours"',
                'Try: "Create a script that unlocks after 7 days"',
                'Try: "Make a timelock for 1 year"'
            ],
            'escrow': [
                'Try: "Create an escrow script with dispute resolution"',
                'Try: "Make a 2-of-3 escrow for online purchases"',
                'Try: "Create an escrow with mediator"'
            ],
            'hashlock': [
                'Try: "Make a hash lock script for atomic swaps"',
                'Try: "Create an HTLC for Lightning Network"',
                'Try: "Make a secret-based spending script"'
            ],
            'lightning': [
                'Try: "Create a Lightning Network payment channel script"',
                'Try: "Make a Lightning channel with penalty"',
                'Try: "Create an off-chain payment script"'
            ]
        };
        return suggestions[scriptType] || this.getGeneralSuggestions();
    }

    getGeneralSuggestions() {
        return [
            'Try: "Create a 2-of-3 multisig for shared custody"',
            'Try: "Make a timelock script that locks funds for 24 hours"',
            'Try: "Create an escrow script with dispute resolution"',
            'Try: "Make a hash lock script for atomic swaps"',
            'Try: "Create a Lightning Network payment channel script"',
            'Try: "Make a vault script with recovery"',
            'Try: "Create a DAO voting script"',
            'Try: "Make an insurance payout script"',
            'Try: "Create an inheritance script"',
            'Try: "Make a subscription payment script"'
        ];
    }
}

// Initialize the AI script generator
window.aiScriptGenerator = new AIScriptGenerator();