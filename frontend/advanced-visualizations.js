// Bitcoin Script Learning Lab - Advanced p5.js Visualizations
// More sophisticated visualizations for advanced Bitcoin Script concepts

class AdvancedBitcoinVisualizations {
    constructor() {
        this.blockchainViz = null;
        this.scriptDebugger = null;
        this.cryptographicViz = null;
        this.networkViz = null;
    }

    init() {
        this.initBlockchainViz();
        this.initScriptDebugger();
        this.initCryptographicViz();
        this.initNetworkViz();
    }

    // Blockchain Visualization
    initBlockchainViz() {
        this.blockchainViz = new p5((p) => {
            let blocks = [];
            let transactions = [];
            let isAnimating = false;

            p.setup = () => {
                const canvas = p.createCanvas(600, 400);
                canvas.parent('blockchain-viz');
                p.background(10, 10, 10); // Dark background
                this.setupBlockchain();
            };

            p.draw = () => {
                p.background(10, 10, 10); // Dark background
                this.drawBlockchain(p);
                
                if (isAnimating) {
                    this.animateBlockchain(p);
                }
            };

            this.setupBlockchain = () => {
                blocks = [];
                for (let i = 0; i < 5; i++) {
                    blocks.push({
                        x: 50 + i * 100,
                        y: 200,
                        height: 80,
                        width: 80,
                        hash: this.generateHash(),
                        transactions: Math.floor(p.random(100, 1000)),
                        timestamp: Date.now() - (4 - i) * 600000 // 10 minutes apart
                    });
                }
            };

            this.drawBlockchain = (p) => {
                p.textAlign(p.CENTER);
                p.textSize(18);
                p.text('Bitcoin Blockchain', p.width/2, 30);

                // Draw blocks
                for (let i = 0; i < blocks.length; i++) {
                    const block = blocks[i];
                    
                    // Draw block
                    p.fill(200, 200, 255);
                    p.rect(block.x, block.y, block.width, block.height);
                    
                    // Draw block number
                    p.fill(0);
                    p.textSize(12);
                    p.text(`Block ${i + 1}`, block.x + 40, block.y + 20);
                    
                    // Draw hash (shortened)
                    p.textSize(8);
                    p.text(block.hash.substring(0, 8) + '...', block.x + 40, block.y + 35);
                    
                    // Draw transaction count
                    p.text(`TX: ${block.transactions}`, block.x + 40, block.y + 50);
                    
                    // Draw timestamp
                    const time = new Date(block.timestamp);
                    p.text(time.toLocaleTimeString(), block.x + 40, block.y + 65);
                    
                    // Draw connection to next block
                    if (i < blocks.length - 1) {
                        p.stroke(100);
                        p.strokeWeight(2);
                        p.line(block.x + 80, block.y + 40, block.x + 100, block.y + 40);
                    }
                }

                // Draw transactions
                this.drawTransactions(p);
            };

            this.drawTransactions = (p) => {
                p.textAlign(p.LEFT);
                p.textSize(14);
                p.text('Transactions in Latest Block:', 50, 320);
                
                for (let i = 0; i < 3; i++) {
                    const tx = {
                        x: 50,
                        y: 340 + i * 20,
                        hash: this.generateHash().substring(0, 16),
                        amount: p.random(0.001, 1.0).toFixed(3)
                    };
                    
                    p.fill(255, 255, 200);
                    p.rect(tx.x, tx.y - 15, 500, 18);
                    
                    p.fill(0);
                    p.text(`${tx.hash}... - ${tx.amount} BTC`, tx.x + 5, tx.y);
                }
            };

            this.animateBlockchain = (p) => {
                // Animate new block creation
                if (p.frameCount % 60 === 0) {
                    const newBlock = {
                        x: 50 + blocks.length * 100,
                        y: 200,
                        height: 80,
                        width: 80,
                        hash: this.generateHash(),
                        transactions: Math.floor(p.random(100, 1000)),
                        timestamp: Date.now()
                    };
                    blocks.push(newBlock);
                }
            };

            this.generateHash = () => {
                return Math.random().toString(16).substr(2, 64);
            };

            // Expose methods globally
            window.startBlockchainViz = () => {
                isAnimating = true;
            };

            window.resetBlockchainViz = () => {
                isAnimating = false;
                this.setupBlockchain();
            };
        });
    }

    // Script Debugger
    initScriptDebugger() {
        this.scriptDebugger = new p5((p) => {
            let script = [];
            let stack = [];
            let currentStep = 0;
            let isDebugging = false;
            let breakpoints = [];

            p.setup = () => {
                const canvas = p.createCanvas(600, 400);
                canvas.parent('script-debugger');
                p.background(240);
                this.setupScriptDebugger();
            };

            p.draw = () => {
                p.background(240);
                this.drawScriptDebugger(p);
            };

            this.setupScriptDebugger = () => {
                script = [
                    { opcode: 'OP_2', description: 'Push 2 onto stack', color: [255, 100, 100] },
                    { opcode: 'PubKey1', description: 'Push first public key', color: [100, 255, 100] },
                    { opcode: 'PubKey2', description: 'Push second public key', color: [100, 255, 100] },
                    { opcode: 'OP_2', description: 'Push 2 onto stack', color: [255, 100, 100] },
                    { opcode: 'OP_CHECKMULTISIG', description: 'Verify 2-of-2 multisig', color: [255, 200, 100] }
                ];
                stack = [];
                currentStep = 0;
                breakpoints = [2, 4]; // Set breakpoints
            };

            this.drawScriptDebugger = (p) => {
                p.textAlign(p.LEFT);
                p.textSize(16);
                p.text('Bitcoin Script Debugger', 20, 30);

                // Draw script
                p.textSize(12);
                p.text('Script:', 20, 60);
                
                for (let i = 0; i < script.length; i++) {
                    const x = 20;
                    const y = 80 + i * 30;
                    const isCurrent = i === currentStep;
                    const isBreakpoint = breakpoints.includes(i);
                    
                    // Highlight current step
                    if (isCurrent) {
                        p.fill(255, 255, 0);
                        p.rect(x - 5, y - 20, 550, 25);
                    }
                    
                    // Highlight breakpoint
                    if (isBreakpoint) {
                        p.fill(255, 0, 0);
                        p.ellipse(x - 10, y - 5, 8, 8);
                    }
                    
                    // Draw opcode
                    p.fill(script[i].color);
                    p.rect(x, y - 15, 100, 20);
                    p.fill(0);
                    p.text(script[i].opcode, x + 5, y);
                    
                    // Draw description
                    p.fill(100);
                    p.text(script[i].description, x + 110, y);
                }

                // Draw stack
                p.text('Stack:', 20, 250);
                for (let i = 0; i < stack.length; i++) {
                    const x = 20 + i * 80;
                    const y = 270;
                    
                    p.fill(200, 200, 255);
                    p.rect(x, y, 70, 25);
                    p.fill(0);
                    p.text(stack[i], x + 5, y + 17);
                }

                // Draw controls
                p.fill(0);
                p.text(`Step: ${currentStep + 1}/${script.length}`, 20, 320);
                p.text(`Stack Size: ${stack.length}`, 20, 340);
                
                if (isDebugging) {
                    p.fill(0, 255, 0);
                    p.text('Debugging...', 20, 360);
                } else {
                    p.fill(255, 0, 0);
                    p.text('Stopped', 20, 360);
                }
            };

            // Expose methods globally
            window.startScriptDebugger = () => {
                isDebugging = true;
                this.stepThroughScript();
            };

            window.stepScriptDebugger = () => {
                if (currentStep < script.length) {
                    const step = script[currentStep];
                    
                    if (step.opcode === 'OP_2') {
                        stack.push('2');
                    } else if (step.opcode === 'OP_CHECKMULTISIG') {
                        stack.push('VALID');
                    } else if (step.opcode.startsWith('PubKey')) {
                        stack.push(step.opcode);
                    }
                    
                    currentStep++;
                }
            };

            window.resetScriptDebugger = () => {
                isDebugging = false;
                currentStep = 0;
                stack = [];
                this.setupScriptDebugger();
            };

            this.stepThroughScript = () => {
                if (currentStep < script.length) {
                    setTimeout(() => {
                        this.stepScriptDebugger();
                        if (isDebugging) {
                            this.stepThroughScript();
                        }
                    }, 1000);
                }
            };
        });
    }

    // Cryptographic Visualization
    initCryptographicViz() {
        this.cryptographicViz = new p5((p) => {
            let keys = [];
            let signatures = [];
            let isGenerating = false;

            p.setup = () => {
                const canvas = p.createCanvas(600, 400);
                canvas.parent('cryptographic-viz');
                p.background(240);
            };

            p.draw = () => {
                p.background(240);
                this.drawCryptographicViz(p);
                
                if (isGenerating) {
                    this.animateCryptographicGeneration(p);
                }
            };

            this.drawCryptographicViz = (p) => {
                p.textAlign(p.CENTER);
                p.textSize(18);
                p.text('Cryptographic Operations', p.width/2, 30);

                // Draw key generation
                p.textAlign(p.LEFT);
                p.textSize(14);
                p.text('Key Generation:', 20, 60);
                
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const x = 20 + i * 120;
                    const y = 80;
                    
                    // Draw private key
                    p.fill(255, 200, 200);
                    p.rect(x, y, 100, 30);
                    p.fill(0);
                    p.textSize(8);
                    p.text('Private Key', x + 5, y + 15);
                    p.text(key.private.substring(0, 8) + '...', x + 5, y + 25);
                    
                    // Draw public key
                    p.fill(200, 255, 200);
                    p.rect(x, y + 40, 100, 30);
                    p.fill(0);
                    p.text('Public Key', x + 5, y + 55);
                    p.text(key.public.substring(0, 8) + '...', x + 5, y + 65);
                    
                    // Draw address
                    p.fill(200, 200, 255);
                    p.rect(x, y + 80, 100, 30);
                    p.fill(0);
                    p.text('Address', x + 5, y + 95);
                    p.text(key.address.substring(0, 8) + '...', x + 5, y + 105);
                }

                // Draw signatures
                p.text('Signatures:', 20, 200);
                for (let i = 0; i < signatures.length; i++) {
                    const sig = signatures[i];
                    const x = 20 + i * 120;
                    const y = 220;
                    
                    p.fill(255, 255, 200);
                    p.rect(x, y, 100, 30);
                    p.fill(0);
                    p.textSize(8);
                    p.text('Signature', x + 5, y + 15);
                    p.text(sig.substring(0, 8) + '...', x + 5, y + 25);
                }

                // Draw hash operations
                p.text('Hash Operations:', 20, 280);
                p.fill(200, 255, 255);
                p.rect(20, 300, 200, 30);
                p.fill(0);
                p.text('SHA256: Input → Hash', 30, 320);
                
                p.fill(200, 255, 255);
                p.rect(240, 300, 200, 30);
                p.fill(0);
                p.text('RIPEMD160: Hash → Address', 250, 320);
            };

            this.animateCryptographicGeneration = (p) => {
                if (keys.length < 3 && p.frameCount % 60 === 0) {
                    const newKey = {
                        private: this.generateRandomHex(64),
                        public: this.generateRandomHex(66),
                        address: this.generateRandomHex(40)
                    };
                    keys.push(newKey);
                }
                
                if (keys.length >= 3 && signatures.length < 2) {
                    const newSig = this.generateRandomHex(128);
                    signatures.push(newSig);
                }
            };

            this.generateRandomHex = (length) => {
                return Math.random().toString(16).substr(2, length);
            };

            // Expose methods globally
            window.startCryptographicViz = () => {
                isGenerating = true;
                keys = [];
                signatures = [];
            };

            window.resetCryptographicViz = () => {
                isGenerating = false;
                keys = [];
                signatures = [];
            };
        });
    }

    // Network Visualization
    initNetworkViz() {
        this.networkViz = new p5((p) => {
            let nodes = [];
            let connections = [];
            let messages = [];
            let isAnimating = false;

            p.setup = () => {
                const canvas = p.createCanvas(600, 400);
                canvas.parent('network-viz');
                p.background(240);
                this.setupNetwork();
            };

            p.draw = () => {
                p.background(240);
                this.drawNetwork(p);
                
                if (isAnimating) {
                    this.animateNetwork(p);
                }
            };

            this.setupNetwork = () => {
                nodes = [];
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * p.TWO_PI;
                    const x = 300 + 150 * p.cos(angle);
                    const y = 200 + 150 * p.sin(angle);
                    
                    nodes.push({
                        x: x,
                        y: y,
                        id: i,
                        type: i < 3 ? 'miner' : 'node',
                        connections: []
                    });
                }
                
                // Create connections
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        if (p.random() < 0.3) {
                            connections.push({
                                from: i,
                                to: j,
                                active: false
                            });
                        }
                    }
                }
            };

            this.drawNetwork = (p) => {
                p.textAlign(p.CENTER);
                p.textSize(18);
                p.text('Bitcoin Network', p.width/2, 30);

                // Draw connections
                p.stroke(100);
                p.strokeWeight(1);
                for (let conn of connections) {
                    const from = nodes[conn.from];
                    const to = nodes[conn.to];
                    p.line(from.x, from.y, to.x, to.y);
                }

                // Draw nodes
                for (let node of nodes) {
                    const color = node.type === 'miner' ? [255, 100, 100] : [100, 100, 255];
                    p.fill(color);
                    p.ellipse(node.x, node.y, 20, 20);
                    
                    p.fill(0);
                    p.textSize(10);
                    p.text(node.type, node.x, node.y + 30);
                }

                // Draw messages
                for (let msg of messages) {
                    p.fill(255, 255, 0);
                    p.ellipse(msg.x, msg.y, 8, 8);
                }
            };

            this.animateNetwork = (p) => {
                // Animate message passing
                if (p.frameCount % 30 === 0) {
                    const from = nodes[Math.floor(p.random(nodes.length))];
                    const to = nodes[Math.floor(p.random(nodes.length))];
                    
                    messages.push({
                        x: from.x,
                        y: from.y,
                        targetX: to.x,
                        targetY: to.y,
                        progress: 0
                    });
                }
                
                // Update message positions
                for (let i = messages.length - 1; i >= 0; i--) {
                    const msg = messages[i];
                    msg.progress += 0.02;
                    
                    msg.x = p.lerp(msg.x, msg.targetX, 0.1);
                    msg.y = p.lerp(msg.y, msg.targetY, 0.1);
                    
                    if (msg.progress >= 1) {
                        messages.splice(i, 1);
                    }
                }
            };

            // Expose methods globally
            window.startNetworkViz = () => {
                isAnimating = true;
            };

            window.resetNetworkViz = () => {
                isAnimating = false;
                messages = [];
                this.setupNetwork();
            };
        });
    }
}

// Initialize advanced visualizations
document.addEventListener('DOMContentLoaded', function() {
    const advancedViz = new AdvancedBitcoinVisualizations();
    advancedViz.init();
    console.log('🚀 Advanced Bitcoin Visualizations initialized!');
});
