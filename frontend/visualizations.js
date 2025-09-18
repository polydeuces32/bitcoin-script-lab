// Bitcoin Script Learning Lab - p5.js Visualizations
// Interactive visualizations to help understand Bitcoin Script concepts

class BitcoinVisualizations {
    constructor() {
        this.scriptSimulator = null;
        this.transactionFlow = null;
        this.keyGeneration = null;
        this.multisigViz = null;
    }

    // Initialize all visualizations
    init() {
        this.initScriptSimulator();
        this.initTransactionFlow();
        this.initKeyGeneration();
        this.initMultisigViz();
    }

    // Script Execution Simulator
    initScriptSimulator() {
        this.scriptSimulator = new p5((p) => {
            let stack = [];
            let script = [];
            let currentStep = 0;
            let isRunning = false;
            let stepDelay = 1000;
            let lastStepTime = 0;

            p.setup = () => {
                const canvas = p.createCanvas(400, 300);
                canvas.parent('script-simulator');
                p.background(10, 10, 10); // Dark background
                this.setupScriptSimulator();
            };

            p.draw = () => {
                p.background(10, 10, 10); // Dark background
                this.drawScriptSimulator(p);
                
                if (isRunning && p.millis() - lastStepTime > stepDelay) {
                    this.executeNextStep(p);
                    lastStepTime = p.millis();
                }
            };

            this.setupScriptSimulator = () => {
                // Example multisig script: OP_2 <pubkey1> <pubkey2> OP_2 OP_CHECKMULTISIG
                script = [
                    { type: 'opcode', value: 'OP_2', color: [255, 100, 100] },
                    { type: 'data', value: 'PubKey1', color: [100, 255, 100] },
                    { type: 'data', value: 'PubKey2', color: [100, 255, 100] },
                    { type: 'opcode', value: 'OP_2', color: [255, 100, 100] },
                    { type: 'opcode', value: 'OP_CHECKMULTISIG', color: [255, 200, 100] }
                ];
                stack = [];
                currentStep = 0;
            };

            this.drawScriptSimulator = (p) => {
                p.fill(0, 255, 0); // Green text
                p.textAlign(p.CENTER);
                p.textSize(16);
                p.text('Bitcoin Script Execution', p.width/2, 30);

                // Draw script
                p.textAlign(p.LEFT);
                p.textSize(12);
                p.text('Script:', 20, 60);
                
                for (let i = 0; i < script.length; i++) {
                    const x = 20 + (i * 70);
                    const y = 80;
                    const isActive = i === currentStep;
                    
                    // Dark terminal colors
                    p.fill(20, 20, 20);
                    if (isActive) {
                        p.fill(0, 255, 0); // Bright green for active
                        p.ellipse(x + 30, y - 10, 10, 10);
                    }
                    
                    p.rect(x, y, 60, 30);
                    p.fill(0, 255, 0); // Green text
                    p.text(script[i].value, x + 5, y + 20);
                }

                // Draw stack
                p.fill(0, 255, 0);
                p.text('Stack:', 20, 140);
                for (let i = 0; i < stack.length; i++) {
                    const x = 20 + (i * 80);
                    const y = 160;
                    
                    p.fill(20, 20, 20); // Dark background
                    p.rect(x, y, 70, 25);
                    p.fill(0, 255, 0); // Green text
                    p.text(stack[i], x + 5, y + 17);
                }

                // Draw status
                p.fill(0, 255, 0);
                p.text(`Step: ${currentStep + 1}/${script.length}`, 20, 220);
                p.text(`Stack Size: ${stack.length}`, 20, 240);
                
                if (isRunning) {
                    p.fill(0, 255, 0);
                    p.text('Running...', 20, 260);
                } else {
                    p.fill(255, 0, 0);
                    p.text('Stopped', 20, 260);
                }
            };

            this.executeNextStep = (p) => {
                if (currentStep < script.length) {
                    const step = script[currentStep];
                    
                    if (step.type === 'opcode') {
                        if (step.value === 'OP_2') {
                            stack.push('2');
                        } else if (step.value === 'OP_CHECKMULTISIG') {
                            // Simulate multisig check
                            stack.push('VALID');
                        }
                    } else if (step.type === 'data') {
                        stack.push(step.value);
                    }
                    
                    currentStep++;
                    
                    if (currentStep >= script.length) {
                        isRunning = false;
                    }
                }
            };

            // Expose methods globally
            window.startScriptSimulation = () => {
                isRunning = true;
                lastStepTime = p.millis();
            };

            window.resetScriptSimulation = () => {
                isRunning = false;
                currentStep = 0;
                stack = [];
                this.setupScriptSimulator();
            };
        });
    }

    // Transaction Flow Visualization
    initTransactionFlow() {
        this.transactionFlow = new p5((p) => {
            let nodes = [];
            let connections = [];
            let isAnimating = false;
            let animationTime = 0;

            p.setup = () => {
                const canvas = p.createCanvas(400, 300);
                canvas.parent('transaction-flow');
                p.background(10, 10, 10); // Dark background
                this.setupTransactionFlow();
            };

            p.draw = () => {
                p.background(10, 10, 10); // Dark background
                this.drawTransactionFlow(p);
                
                if (isAnimating) {
                    animationTime += p.deltaTime;
                    this.animateTransactionFlow(p);
                }
            };

            this.setupTransactionFlow = () => {
                nodes = [
                    { x: 50, y: 150, label: 'User', type: 'user' },
                    { x: 150, y: 100, label: 'Wallet', type: 'wallet' },
                    { x: 150, y: 200, label: 'Script', type: 'script' },
                    { x: 250, y: 150, label: 'Network', type: 'network' },
                    { x: 350, y: 150, label: 'Blockchain', type: 'blockchain' }
                ];

                connections = [
                    { from: 0, to: 1, label: 'Create TX' },
                    { from: 1, to: 2, label: 'Sign' },
                    { from: 2, to: 3, label: 'Broadcast' },
                    { from: 3, to: 4, label: 'Confirm' }
                ];
            };

            this.drawTransactionFlow = (p) => {
                p.fill(0, 255, 0); // Green text
                p.textAlign(p.CENTER);
                p.textSize(16);
                p.text('Transaction Flow', p.width/2, 30);

                // Draw connections
                p.stroke(0, 255, 0); // Green lines
                p.strokeWeight(2);
                for (let conn of connections) {
                    const from = nodes[conn.from];
                    const to = nodes[conn.to];
                    p.line(from.x, from.y, to.x, to.y);
                    
                    // Draw arrow
                    const angle = p.atan2(to.y - from.y, to.x - from.x);
                    const arrowX = to.x - 15 * p.cos(angle);
                    const arrowY = to.y - 15 * p.sin(angle);
                    p.line(arrowX, arrowY, arrowX - 10 * p.cos(angle - 0.5), arrowY - 10 * p.sin(angle - 0.5));
                    p.line(arrowX, arrowY, arrowX - 10 * p.cos(angle + 0.5), arrowY - 10 * p.sin(angle + 0.5));
                }

                // Draw nodes
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const colors = {
                        user: [0, 255, 0],      // Green
                        wallet: [255, 170, 0],  // Orange
                        script: [0, 255, 255],  // Cyan
                        network: [255, 0, 255], // Magenta
                        blockchain: [255, 0, 0]  // Red
                    };
                    
                    p.fill(colors[node.type]);
                    p.ellipse(node.x, node.y, 40, 40);
                    
                    p.fill(0, 255, 0); // Green text
                    p.textSize(10);
                    p.text(node.label, node.x, node.y + 5);
                }

                // Draw animation
                if (isAnimating) {
                    this.drawAnimation(p);
                }
            };

            this.animateTransactionFlow = (p) => {
                // Simple animation that moves a dot along the connections
                const totalTime = 3000; // 3 seconds
                const progress = (animationTime % totalTime) / totalTime;
                
                // Calculate position along the path
                const pathLength = connections.length;
                const segmentProgress = (progress * pathLength) % 1;
                const segmentIndex = Math.floor(progress * pathLength);
                
                if (segmentIndex < connections.length) {
                    const conn = connections[segmentIndex];
                    const from = nodes[conn.from];
                    const to = nodes[conn.to];
                    
                    const x = p.lerp(from.x, to.x, segmentProgress);
                    const y = p.lerp(from.y, to.y, segmentProgress);
                    
                    p.fill(255, 0, 0);
                    p.ellipse(x, y, 8, 8);
                }
            };

            this.drawAnimation = (p) => {
                // Additional animation effects
                p.fill(255, 255, 0, 100);
                p.noStroke();
                for (let node of nodes) {
                    p.ellipse(node.x, node.y, 50 + 10 * p.sin(animationTime * 0.01), 50 + 10 * p.sin(animationTime * 0.01));
                }
            };

            // Expose methods globally
            window.startTransactionFlow = () => {
                isAnimating = true;
                animationTime = 0;
            };

            window.resetTransactionFlow = () => {
                isAnimating = false;
                animationTime = 0;
            };
        });
    }

    // Key Generation Visualization
    initKeyGeneration() {
        this.keyGeneration = new p5((p) => {
            let keys = [];
            let isGenerating = false;
            let generationTime = 0;

            p.setup = () => {
                const canvas = p.createCanvas(400, 300);
                canvas.parent('key-generation');
                p.background(10, 10, 10); // Dark background
            };

            p.draw = () => {
                p.background(10, 10, 10); // Dark background
                this.drawKeyGeneration(p);
                
                if (isGenerating) {
                    generationTime += p.deltaTime;
                    this.animateKeyGeneration(p);
                }
            };

            this.drawKeyGeneration = (p) => {
                p.textAlign(p.CENTER);
                p.textSize(16);
                p.text('Cryptographic Key Generation', p.width/2, 30);

                // Draw keys
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const x = 50 + (i * 100);
                    const y = 150;
                    
                    // Draw key as a circle with pattern
                    p.fill(key.color);
                    p.ellipse(x, y, 60, 60);
                    
                    // Draw key pattern
                    p.fill(0);
                    p.textSize(8);
                    p.text(key.pattern, x, y);
                    
                    // Draw key label
                    p.textSize(10);
                    p.text(key.label, x, y + 40);
                }

                // Draw generation process
                if (isGenerating) {
                    p.fill(255, 0, 0);
                    p.text('Generating...', p.width/2, 250);
                }
            };

            this.animateKeyGeneration = (p) => {
                // Generate new keys over time
                if (keys.length < 3 && generationTime > 1000) {
                    const newKey = {
                        label: `Key ${keys.length + 1}`,
                        color: [p.random(100, 255), p.random(100, 255), p.random(100, 255)],
                        pattern: this.generateKeyPattern()
                    };
                    keys.push(newKey);
                    generationTime = 0;
                }
                
                if (keys.length >= 3) {
                    isGenerating = false;
                }
            };

            this.generateKeyPattern = () => {
                const patterns = ['🔑', '⚡', '🔐', '🛡️', '🔒'];
                return patterns[Math.floor(p.random(patterns.length))];
            };

            // Expose methods globally
            window.startKeyGeneration = () => {
                isGenerating = true;
                generationTime = 0;
                keys = [];
            };
        });
    }

    // Multisig Visualization
    initMultisigViz() {
        this.multisigViz = new p5((p) => {
            let participants = [];
            let signatures = [];
            let isShowing = false;

            p.setup = () => {
                const canvas = p.createCanvas(400, 300);
                canvas.parent('multisig-viz');
                p.background(10, 10, 10); // Dark background
                this.setupMultisigViz();
            };

            p.draw = () => {
                p.background(10, 10, 10); // Dark background
                this.drawMultisigViz(p);
            };

            this.setupMultisigViz = () => {
                participants = [
                    { x: 100, y: 100, label: 'Alice', hasSigned: false },
                    { x: 200, y: 100, label: 'Bob', hasSigned: false },
                    { x: 300, y: 100, label: 'Charlie', hasSigned: false }
                ];
                signatures = [];
            };

            this.drawMultisigViz = (p) => {
                p.textAlign(p.CENTER);
                p.textSize(16);
                p.text('Multisig Visualization', p.width/2, 30);

                // Draw participants
                for (let i = 0; i < participants.length; i++) {
                    const participant = participants[i];
                    const x = participant.x;
                    const y = participant.y;
                    
                    // Draw participant circle
                    p.fill(participant.hasSigned ? [100, 255, 100] : [200, 200, 200]);
                    p.ellipse(x, y, 50, 50);
                    
                    // Draw participant label
                    p.fill(0);
                    p.textSize(12);
                    p.text(participant.label, x, y + 5);
                    
                    // Draw signature status
                    p.textSize(8);
                    p.text(participant.hasSigned ? '✓' : '○', x, y + 20);
                }

                // Draw signatures
                for (let sig of signatures) {
                    p.stroke(255, 0, 0);
                    p.strokeWeight(3);
                    p.line(sig.from.x, sig.from.y, sig.to.x, sig.to.y);
                }

                // Draw requirements
                p.fill(0);
                p.textSize(14);
                p.text('2 of 3 signatures required', p.width/2, 200);
                
                const signedCount = participants.filter(p => p.hasSigned).length;
                p.text(`Signed: ${signedCount}/3`, p.width/2, 220);
                
                if (signedCount >= 2) {
                    p.fill(0, 255, 0);
                    p.text('✓ Transaction can be spent!', p.width/2, 250);
                } else {
                    p.fill(255, 0, 0);
                    p.text('✗ Need more signatures', p.width/2, 250);
                }
            };

            // Expose methods globally
            window.startMultisigViz = () => {
                isShowing = true;
                this.setupMultisigViz();
                
                // Animate signing process
                setTimeout(() => {
                    participants[0].hasSigned = true;
                    signatures.push({
                        from: { x: 100, y: 100 },
                        to: { x: 200, y: 200 }
                    });
                }, 1000);
                
                setTimeout(() => {
                    participants[1].hasSigned = true;
                    signatures.push({
                        from: { x: 200, y: 100 },
                        to: { x: 200, y: 200 }
                    });
                }, 2000);
            };
        });
    }
}

// Initialize visualizations when page loads
document.addEventListener('DOMContentLoaded', function() {
    const viz = new BitcoinVisualizations();
    viz.init();
    console.log('🎨 Bitcoin Script Visualizations initialized!');
});
