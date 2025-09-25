// Advanced Transaction Simulator
class TransactionSimulator {
    constructor() {
        this.transactions = [];
        this.currentTransaction = null;
        this.feeRate = 10; // sat/vB
        this.network = 'testnet';
        
        this.initSimulator();
    }
    
    initSimulator() {
        this.loadSampleTransactions();
        this.updateFeeDisplay();
    }
    
    loadSampleTransactions() {
        this.transactions = [
            {
                id: 'tx_001',
                type: 'multisig_spend',
                inputs: [
                    { address: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC', value: 100000, script: 'multisig' }
                ],
                outputs: [
                    { address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', value: 95000 },
                    { address: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC', value: 4000 } // change
                ],
                fee: 1000,
                status: 'pending'
            },
            {
                id: 'tx_002',
                type: 'timelock_release',
                inputs: [
                    { address: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC', value: 50000, script: 'timelock' }
                ],
                outputs: [
                    { address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', value: 49000 }
                ],
                fee: 1000,
                status: 'confirmed'
            }
        ];
    }
    
    createTransaction() {
        const form = document.getElementById('transaction-form');
        const formData = new FormData(form);
        
        const transaction = {
            id: 'tx_' + Date.now(),
            type: formData.get('tx-type'),
            inputs: this.parseInputs(formData.get('inputs')),
            outputs: this.parseOutputs(formData.get('outputs')),
            fee: 0,
            status: 'draft'
        };
        
        // Calculate fee
        transaction.fee = this.calculateFee(transaction);
        
        this.currentTransaction = transaction;
        this.displayTransaction(transaction);
        this.showNotification('Transaction created successfully', 'success');
    }
    
    parseInputs(inputsText) {
        const lines = inputsText.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const [address, value, script] = line.split(',').map(s => s.trim());
            return {
                address: address,
                value: parseInt(value),
                script: script || 'standard'
            };
        });
    }
    
    parseOutputs(outputsText) {
        const lines = outputssText.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const [address, value] = line.split(',').map(s => s.trim());
            return {
                address: address,
                value: parseInt(value)
            };
        });
    }
    
    calculateFee(transaction) {
        // Simplified fee calculation
        const inputCount = transaction.inputs.length;
        const outputCount = transaction.outputs.length;
        
        // Estimate transaction size (rough calculation)
        const estimatedSize = (inputCount * 148) + (outputCount * 34) + 10;
        
        return Math.ceil(estimatedSize * this.feeRate);
    }
    
    displayTransaction(transaction) {
        const container = document.getElementById('transaction-display');
        
        let html = `
            <div class="transaction-card p-3 border rounded mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5>Transaction ${transaction.id}</h5>
                    <span class="badge bg-${this.getStatusColor(transaction.status)}">${transaction.status}</span>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h6>Inputs (${transaction.inputs.length})</h6>
                        ${transaction.inputs.map(input => `
                            <div class="input-item p-2 border rounded mb-2">
                                <div><strong>Address:</strong> ${input.address}</div>
                                <div><strong>Value:</strong> ${input.value} sats</div>
                                <div><strong>Script:</strong> ${input.script}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="col-md-6">
                        <h6>Outputs (${transaction.outputs.length})</h6>
                        ${transaction.outputs.map(output => `
                            <div class="output-item p-2 border rounded mb-2">
                                <div><strong>Address:</strong> ${output.address}</div>
                                <div><strong>Value:</strong> ${output.value} sats</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="transaction-summary mt-3 p-2 bg-light rounded">
                    <div class="row">
                        <div class="col-md-4">
                            <strong>Total Input:</strong> ${this.getTotalInput(transaction)} sats
                        </div>
                        <div class="col-md-4">
                            <strong>Total Output:</strong> ${this.getTotalOutput(transaction)} sats
                        </div>
                        <div class="col-md-4">
                            <strong>Fee:</strong> ${transaction.fee} sats
                        </div>
                    </div>
                </div>
                
                <div class="transaction-actions mt-3">
                    <button class="btn btn-primary btn-sm" onclick="simulateTransaction('${transaction.id}')">Simulate</button>
                    <button class="btn btn-success btn-sm" onclick="signTransaction('${transaction.id}')">Sign</button>
                    <button class="btn btn-warning btn-sm" onclick="broadcastTransaction('${transaction.id}')">Broadcast</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTransaction('${transaction.id}')">Delete</button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    getTotalInput(transaction) {
        return transaction.inputs.reduce((sum, input) => sum + input.value, 0);
    }
    
    getTotalOutput(transaction) {
        return transaction.outputs.reduce((sum, output) => sum + output.value, 0);
    }
    
    getStatusColor(status) {
        const colors = {
            'draft': 'secondary',
            'pending': 'warning',
            'confirmed': 'success',
            'failed': 'danger'
        };
        return colors[status] || 'secondary';
    }
    
    simulateTransaction(transactionId) {
        const transaction = this.transactions.find(tx => tx.id === transactionId);
        if (!transaction) return;
        
        this.showSimulationModal(transaction);
    }
    
    showSimulationModal(transaction) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Transaction Simulation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="simulation-steps"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        this.runSimulation(transaction);
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    runSimulation(transaction) {
        const stepsDiv = document.getElementById('simulation-steps');
        let html = '<div class="simulation-progress">';
        
        const steps = [
            { step: 1, action: 'Validate transaction structure', status: 'running' },
            { step: 2, action: 'Check input availability', status: 'pending' },
            { step: 3, action: 'Verify signatures', status: 'pending' },
            { step: 4, action: 'Execute scripts', status: 'pending' },
            { step: 5, action: 'Calculate fees', status: 'pending' },
            { step: 6, action: 'Broadcast to network', status: 'pending' }
        ];
        
        steps.forEach((step, index) => {
            html += `
                <div class="simulation-step p-3 border rounded mb-2" id="step-${step.step}">
                    <div class="d-flex align-items-center">
                        <div class="step-number me-3">${step.step}</div>
                        <div class="step-action flex-grow-1">${step.action}</div>
                        <div class="step-status" id="status-${step.step}">
                            <span class="badge bg-secondary">Pending</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        stepsDiv.innerHTML = html;
        
        // Simulate step execution
        this.executeSimulationSteps(steps);
    }
    
    executeSimulationSteps(steps) {
        steps.forEach((step, index) => {
            setTimeout(() => {
                this.updateStepStatus(step.step, 'running');
                
                setTimeout(() => {
                    const success = Math.random() > 0.1; // 90% success rate
                    this.updateStepStatus(step.step, success ? 'success' : 'failed');
                    
                    if (index === steps.length - 1) {
                        this.showSimulationResult(success);
                    }
                }, 1000 + Math.random() * 2000);
            }, index * 1500);
        });
    }
    
    updateStepStatus(stepNumber, status) {
        const statusDiv = document.getElementById(`status-${stepNumber}`);
        const stepDiv = document.getElementById(`step-${stepNumber}`);
        
        const statusClasses = {
            'running': 'bg-warning',
            'success': 'bg-success',
            'failed': 'bg-danger'
        };
        
        const statusTexts = {
            'running': 'Running...',
            'success': 'Success',
            'failed': 'Failed'
        };
        
        statusDiv.innerHTML = `<span class="badge ${statusClasses[status]}">${statusTexts[status]}</span>`;
        
        if (status === 'success') {
            stepDiv.classList.add('border-success');
        } else if (status === 'failed') {
            stepDiv.classList.add('border-danger');
        }
    }
    
    showSimulationResult(success) {
        const stepsDiv = document.getElementById('simulation-steps');
        const resultDiv = document.createElement('div');
        resultDiv.className = `alert alert-${success ? 'success' : 'danger'} mt-3`;
        resultDiv.innerHTML = `
            <h6>Simulation Result</h6>
            <p>${success ? 'Transaction simulation completed successfully!' : 'Transaction simulation failed. Check the errors above.'}</p>
        `;
        stepsDiv.appendChild(resultDiv);
    }
    
    signTransaction(transactionId) {
        const transaction = this.transactions.find(tx => tx.id === transactionId);
        if (!transaction) return;
        
        // Simulate signing process
        this.showNotification('Transaction signing initiated...', 'info');
        
        setTimeout(() => {
            transaction.status = 'signed';
            this.displayTransaction(transaction);
            this.showNotification('Transaction signed successfully', 'success');
        }, 2000);
    }
    
    broadcastTransaction(transactionId) {
        const transaction = this.transactions.find(tx => tx.id === transactionId);
        if (!transaction) return;
        
        // Simulate broadcasting
        this.showNotification('Broadcasting transaction to network...', 'info');
        
        setTimeout(() => {
            transaction.status = 'pending';
            this.displayTransaction(transaction);
            this.showNotification('Transaction broadcasted successfully', 'success');
        }, 3000);
    }
    
    deleteTransaction(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(tx => tx.id !== transactionId);
            document.getElementById('transaction-display').innerHTML = '<div class="text-muted">No transaction selected</div>';
            this.showNotification('Transaction deleted', 'info');
        }
    }
    
    updateFeeDisplay() {
        const feeDisplay = document.getElementById('fee-rate-display');
        if (feeDisplay) {
            feeDisplay.textContent = `${this.feeRate} sat/vB`;
        }
    }
    
    setFeeRate(rate) {
        this.feeRate = rate;
        this.updateFeeDisplay();
        
        if (this.currentTransaction) {
            this.currentTransaction.fee = this.calculateFee(this.currentTransaction);
            this.displayTransaction(this.currentTransaction);
        }
        
        this.showNotification(`Fee rate updated to ${rate} sat/vB`, 'info');
    }
    
    showNotification(message, type = 'info') {
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
}

// Global functions for HTML onclick handlers
let transactionSimulator;

function initTransactionSimulator() {
    transactionSimulator = new TransactionSimulator();
}

function createTransaction() {
    if (transactionSimulator) {
        transactionSimulator.createTransaction();
    }
}

function simulateTransaction(transactionId) {
    if (transactionSimulator) {
        transactionSimulator.simulateTransaction(transactionId);
    }
}

function signTransaction(transactionId) {
    if (transactionSimulator) {
        transactionSimulator.signTransaction(transactionId);
    }
}

function broadcastTransaction(transactionId) {
    if (transactionSimulator) {
        transactionSimulator.broadcastTransaction(transactionId);
    }
}

function deleteTransaction(transactionId) {
    if (transactionSimulator) {
        transactionSimulator.deleteTransaction(transactionId);
    }
}

function setFeeRate(rate) {
    if (transactionSimulator) {
        transactionSimulator.setFeeRate(rate);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTransactionSimulator();
});
