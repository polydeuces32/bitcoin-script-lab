// Interactive Bitcoin Script Editor
class ScriptEditor {
    constructor() {
        this.currentScript = '';
        this.executionSteps = [];
        this.currentStep = 0;
        this.isExecuting = false;
        
        // Initialize CodeMirror editor
        this.initEditor();
        
        // Script templates
        this.templates = {
            multisig: `OP_2
<pubkey1>
<pubkey2>
OP_2
OP_CHECKMULTISIG`,
            
            timelock: `<locktime>
OP_CHECKLOCKTIMEVERIFY
OP_DROP
<pubkey>
OP_CHECKSIG`,
            
            escrow: `OP_2
<buyer_pubkey>
<seller_pubkey>
<arbitrator_pubkey>
OP_3
OP_CHECKMULTISIG`,
            
            hashlock: `OP_SHA256
<hash>
OP_EQUALVERIFY
<pubkey>
OP_CHECKSIG`,
            
            segwit: `OP_0
<witness_program>`
        };
    }
    
    initEditor() {
        // Initialize CodeMirror if available
        if (typeof CodeMirror !== 'undefined') {
            this.editor = CodeMirror.fromTextArea(document.getElementById('script-editor'), {
                mode: 'javascript',
                theme: 'monokai',
                lineNumbers: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                indentUnit: 2,
                tabSize: 2,
                lineWrapping: true
            });
            
            this.editor.on('change', () => {
                this.currentScript = this.editor.getValue();
                this.updateScriptStatus();
            });
        }
    }
    
    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (template) {
            if (this.editor) {
                this.editor.setValue(template);
            } else {
                document.getElementById('script-editor').value = template;
            }
            this.currentScript = template;
            this.updateScriptStatus();
            this.showNotification(`Loaded ${templateName} template`, 'success');
        }
    }
    
    validateScript() {
        const script = this.getScript();
        if (!script.trim()) {
            this.showNotification('Please enter a script to validate', 'warning');
            return;
        }
        
        try {
            const validation = this.parseScript(script);
            this.displayValidation(validation);
            this.showNotification('Script validation completed', 'success');
        } catch (error) {
            this.showNotification(`Validation error: ${error.message}`, 'danger');
        }
    }
    
    parseScript(script) {
        const lines = script.split('\n').filter(line => line.trim());
        const opcodes = [];
        const errors = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('<') && line.endsWith('>')) {
                // Placeholder (pubkey, hash, etc.)
                opcodes.push({
                    type: 'placeholder',
                    value: line,
                    line: i + 1
                });
            } else if (line.startsWith('OP_')) {
                // OpCode
                opcodes.push({
                    type: 'opcode',
                    value: line,
                    line: i + 1
                });
            } else if (line.match(/^[0-9]+$/)) {
                // Number
                opcodes.push({
                    type: 'number',
                    value: parseInt(line),
                    line: i + 1
                });
            } else if (line.match(/^[0-9a-fA-F]+$/)) {
                // Hex data
                opcodes.push({
                    type: 'hex',
                    value: line,
                    line: i + 1
                });
            } else {
                errors.push(`Invalid syntax at line ${i + 1}: ${line}`);
            }
        }
        
        return {
            opcodes,
            errors,
            isValid: errors.length === 0,
            scriptType: this.detectScriptType(opcodes)
        };
    }
    
    detectScriptType(opcodes) {
        const opcodeValues = opcodes.map(op => op.value);
        
        if (opcodeValues.includes('OP_CHECKMULTISIG')) {
            return 'Multisig';
        } else if (opcodeValues.includes('OP_CHECKLOCKTIMEVERIFY')) {
            return 'Timelock';
        } else if (opcodeValues.includes('OP_SHA256')) {
            return 'Hash Lock';
        } else if (opcodeValues.includes('OP_CHECKSIG')) {
            return 'Standard';
        } else {
            return 'Custom';
        }
    }
    
    displayValidation(validation) {
        const statusDiv = document.getElementById('script-status');
        let html = '<div class="validation-result">';
        
        html += `<div class="mb-2"><strong>Script Type:</strong> ${validation.scriptType}</div>`;
        html += `<div class="mb-2"><strong>OpCodes:</strong> ${validation.opcodes.length}</div>`;
        
        if (validation.isValid) {
            html += '<div class="text-success mb-2">✅ Script is valid</div>';
        } else {
            html += '<div class="text-danger mb-2">❌ Script has errors:</div>';
            validation.errors.forEach(error => {
                html += `<div class="text-danger small">• ${error}</div>`;
            });
        }
        
        html += '<div class="mt-3"><strong>OpCode Breakdown:</strong></div>';
        html += '<div class="opcode-list">';
        
        validation.opcodes.forEach((op, index) => {
            const typeClass = op.type === 'opcode' ? 'opcode' : 'text-muted';
            html += `<div class="opcode-item ${typeClass}">${index + 1}. ${op.value}</div>`;
        });
        
        html += '</div></div>';
        statusDiv.innerHTML = html;
    }
    
    executeScript() {
        const script = this.getScript();
        if (!script.trim()) {
            this.showNotification('Please enter a script to execute', 'warning');
            return;
        }
        
        this.executionSteps = [];
        this.currentStep = 0;
        this.isExecuting = true;
        
        try {
            const validation = this.parseScript(script);
            if (!validation.isValid) {
                this.showNotification('Cannot execute invalid script', 'danger');
                return;
            }
            
            this.simulateExecution(validation.opcodes);
            this.showExecutionSteps();
            this.showNotification('Script execution completed', 'success');
        } catch (error) {
            this.showNotification(`Execution error: ${error.message}`, 'danger');
        }
    }
    
    simulateExecution(opcodes) {
        const stack = [];
        const altStack = [];
        
        for (let i = 0; i < opcodes.length; i++) {
            const op = opcodes[i];
            const step = {
                step: i + 1,
                opcode: op.value,
                stackBefore: [...stack],
                stackAfter: [...stack],
                description: this.getOpcodeDescription(op.value)
            };
            
            // Simulate opcode execution
            switch (op.value) {
                case 'OP_2':
                    stack.push(2);
                    break;
                case 'OP_3':
                    stack.push(3);
                    break;
                case 'OP_CHECKMULTISIG':
                    if (stack.length >= 3) {
                        const n = stack.pop();
                        const m = stack.pop();
                        // Simulate signature verification
                        stack.push(1); // Success
                    }
                    break;
                case 'OP_CHECKSIG':
                    if (stack.length >= 2) {
                        stack.pop(); // pubkey
                        stack.pop(); // signature
                        stack.push(1); // Success
                    }
                    break;
                case 'OP_CHECKLOCKTIMEVERIFY':
                    if (stack.length >= 1) {
                        const locktime = stack[stack.length - 1];
                        // Simulate time check
                        stack.push(1); // Success
                    }
                    break;
                case 'OP_DROP':
                    if (stack.length >= 1) {
                        stack.pop();
                    }
                    break;
                case 'OP_SHA256':
                    if (stack.length >= 1) {
                        const data = stack.pop();
                        stack.push('hash_' + data); // Simulated hash
                    }
                    break;
                case 'OP_EQUALVERIFY':
                    if (stack.length >= 2) {
                        const a = stack.pop();
                        const b = stack.pop();
                        if (a === b) {
                            stack.push(1);
                        } else {
                            stack.push(0);
                        }
                    }
                    break;
                default:
                    if (op.type === 'placeholder') {
                        stack.push(op.value);
                    } else if (op.type === 'number') {
                        stack.push(op.value);
                    } else if (op.type === 'hex') {
                        stack.push(op.value);
                    }
            }
            
            step.stackAfter = [...stack];
            this.executionSteps.push(step);
        }
    }
    
    getOpcodeDescription(opcode) {
        const descriptions = {
            'OP_2': 'Push 2 onto the stack',
            'OP_3': 'Push 3 onto the stack',
            'OP_CHECKMULTISIG': 'Verify multiple signatures',
            'OP_CHECKSIG': 'Verify signature',
            'OP_CHECKLOCKTIMEVERIFY': 'Check if locktime has passed',
            'OP_DROP': 'Remove top stack item',
            'OP_SHA256': 'Compute SHA256 hash',
            'OP_EQUALVERIFY': 'Verify two values are equal'
        };
        
        return descriptions[opcode] || 'Unknown opcode';
    }
    
    showExecutionSteps() {
        const executionDiv = document.getElementById('script-execution');
        const stepsDiv = document.getElementById('execution-steps');
        
        let html = '';
        this.executionSteps.forEach((step, index) => {
            html += `<div class="execution-step mb-3 p-3 border rounded">`;
            html += `<div class="step-header"><strong>Step ${step.step}:</strong> ${step.opcode}</div>`;
            html += `<div class="step-description text-muted small">${step.description}</div>`;
            html += `<div class="step-stack">`;
            html += `<div class="stack-before"><strong>Stack Before:</strong> [${step.stackBefore.join(', ')}]</div>`;
            html += `<div class="stack-after"><strong>Stack After:</strong> [${step.stackAfter.join(', ')}]</div>`;
            html += `</div></div>`;
        });
        
        stepsDiv.innerHTML = html;
        executionDiv.style.display = 'block';
    }
    
    generateAddress() {
        const script = this.getScript();
        if (!script.trim()) {
            this.showNotification('Please enter a script to generate address', 'warning');
            return;
        }
        
        try {
            const validation = this.parseScript(script);
            if (!validation.isValid) {
                this.showNotification('Cannot generate address for invalid script', 'danger');
                return;
            }
            
            // Simulate address generation
            const address = this.simulateAddressGeneration(script);
            this.showAddressResult(address);
            this.showNotification('Address generated successfully', 'success');
        } catch (error) {
            this.showNotification(`Address generation error: ${error.message}`, 'danger');
        }
    }
    
    simulateAddressGeneration(script) {
        // Simulate P2SH address generation
        const scriptHash = this.simpleHash(script);
        const address = '3' + scriptHash.substring(0, 33); // Simulated P2SH address
        
        return {
            script: script,
            scriptHash: scriptHash,
            address: address,
            type: 'P2SH'
        };
    }
    
    simpleHash(input) {
        // Simple hash simulation
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    showAddressResult(addressData) {
        const statusDiv = document.getElementById('script-status');
        let html = '<div class="address-result">';
        html += '<div class="mb-2"><strong>Generated Address:</strong></div>';
        html += `<div class="address-output mb-2">${addressData.address}</div>`;
        html += `<div class="mb-2"><strong>Script Hash:</strong> ${addressData.scriptHash}</div>`;
        html += `<div class="mb-2"><strong>Type:</strong> ${addressData.type}</div>`;
        html += '</div>';
        statusDiv.innerHTML = html;
    }
    
    clearEditor() {
        if (this.editor) {
            this.editor.setValue('');
        } else {
            document.getElementById('script-editor').value = '';
        }
        this.currentScript = '';
        this.updateScriptStatus();
        document.getElementById('script-execution').style.display = 'none';
        this.showNotification('Editor cleared', 'info');
    }
    
    getScript() {
        if (this.editor) {
            return this.editor.getValue();
        } else {
            return document.getElementById('script-editor').value;
        }
    }
    
    updateScriptStatus() {
        const script = this.getScript();
        const statusDiv = document.getElementById('script-status');
        
        if (!script.trim()) {
            statusDiv.innerHTML = '<div class="text-muted">No script loaded</div>';
            return;
        }
        
        const lines = script.split('\n').filter(line => line.trim()).length;
        statusDiv.innerHTML = `<div class="text-info">Script loaded: ${lines} lines</div>`;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
let scriptEditor;

function initScriptEditor() {
    scriptEditor = new ScriptEditor();
}

function loadTemplate(templateName) {
    if (scriptEditor) {
        scriptEditor.loadTemplate(templateName);
    }
}

function validateScript() {
    if (scriptEditor) {
        scriptEditor.validateScript();
    }
}

function executeScript() {
    if (scriptEditor) {
        scriptEditor.executeScript();
    }
}

function generateAddress() {
    if (scriptEditor) {
        scriptEditor.generateAddress();
    }
}

function clearEditor() {
    if (scriptEditor) {
        scriptEditor.clearEditor();
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '🌙';
        themeToggle.innerHTML = '<span id="theme-icon">🌙</span> Dark Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☀️';
        themeToggle.innerHTML = '<span id="theme-icon">☀️</span> Light Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeToggle = document.getElementById('theme-toggle');
    
    body.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        themeIcon.textContent = '☀️';
        themeToggle.innerHTML = '<span id="theme-icon">☀️</span> Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeToggle.innerHTML = '<span id="theme-icon">🌙</span> Dark Mode';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScriptEditor();
});
