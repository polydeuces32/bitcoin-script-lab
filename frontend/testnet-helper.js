// Bitcoin Script Learning Lab - Testnet Helper
// Comprehensive testnet functionality for getting coins and testing scripts

class TestnetHelper {
    constructor() {
        this.faucets = [
            {
                name: 'CoinFaucet',
                url: 'https://coinfaucet.eu/en/btc-testnet/',
                amount: '0.001 tBTC',
                frequency: 'Every 24 hours',
                description: 'Most reliable testnet faucet'
            },
            {
                name: 'Blockstream Faucet',
                url: 'https://blockstream.info/testnet/faucet',
                amount: '0.001 tBTC',
                frequency: 'Every 24 hours',
                description: 'Official Blockstream testnet faucet'
            },
            {
                name: 'Mempool Faucet',
                url: 'https://testnet-faucet.mempool.co/',
                amount: '0.001 tBTC',
                frequency: 'Every 24 hours',
                description: 'Alternative testnet faucet'
            }
        ];
        
        this.explorers = [
            {
                name: 'Blockstream Explorer',
                url: 'https://blockstream.info/testnet/',
                description: 'Official Bitcoin testnet explorer'
            },
            {
                name: 'Mempool Explorer',
                url: 'https://mempool.space/testnet',
                description: 'Alternative testnet explorer'
            }
        ];
        
        this.currentAddress = null;
        this.lastGeneratedScript = null;
    }
    
    // Initialize testnet helper
    init() {
        this.createTestnetHelper();
        this.setupEventListeners();
        console.log('🪙 Testnet Helper initialized');
    }
    
    // Create the testnet helper interface
    createTestnetHelper() {
        const testnetContainer = document.createElement('div');
        testnetContainer.id = 'testnet-helper';
        testnetContainer.innerHTML = `
            <div class="card">
                <div class="card-header bg-warning text-dark">
                    <h3 class="card-title mb-0">🪙 Testnet Helper</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Get Testnet Coins</h5>
                            <div class="mb-3">
                                <label class="form-label">Your Testnet Address:</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="testnet-address" 
                                        placeholder="Generated from script above" readonly>
                                    <button class="btn btn-outline-primary" onclick="copyTestnetAddress()">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <button class="btn btn-success btn-sm me-2" onclick="openFaucet('coinfaucet')">
                                    <i class="fas fa-coins"></i> CoinFaucet
                                </button>
                                <button class="btn btn-success btn-sm me-2" onclick="openFaucet('blockstream')">
                                    <i class="fas fa-coins"></i> Blockstream
                                </button>
                                <button class="btn btn-success btn-sm" onclick="openFaucet('mempool')">
                                    <i class="fas fa-coins"></i> Mempool
                                </button>
                            </div>
                            
                            <div class="alert alert-info">
                                <small>
                                    <strong>Instructions:</strong><br>
                                    1. Generate a script above to get an address<br>
                                    2. Copy the address<br>
                                    3. Click a faucet button to open it<br>
                                    4. Paste your address and request coins<br>
                                    5. Wait 5-10 minutes for confirmation
                                </small>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h5>Check Your Address</h5>
                            <div class="mb-3">
                                <button class="btn btn-primary btn-sm me-2" onclick="checkAddress('blockstream')">
                                    <i class="fas fa-search"></i> Blockstream
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="checkAddress('mempool')">
                                    <i class="fas fa-search"></i> Mempool
                                </button>
                            </div>
                            
                            <h5>Broadcast Transaction</h5>
                            <div class="mb-3">
                                <button class="btn btn-warning btn-sm" onclick="openBroadcast()">
                                    <i class="fas fa-broadcast-tower"></i> Broadcast TX
                                </button>
                            </div>
                            
                            <div class="alert alert-warning">
                                <small>
                                    <strong>Tips:</strong><br>
                                    • Each faucet has a 24-hour cooldown<br>
                                    • Start with 0.001 tBTC per request<br>
                                    • Use multiple faucets for more coins<br>
                                    • Always use testnet addresses (start with '3')
                                </small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-12">
                            <h5>Testnet Status</h5>
                            <div id="testnet-status" class="alert alert-success">
                                <span class="status-indicator">🟢</span>
                                <span class="status-text">Testnet Helper: Ready</span>
                                <span class="last-update" id="testnet-last-update">Last update: ${new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after the market data dashboard
        const marketDashboard = document.getElementById('market-data-dashboard');
        if (marketDashboard) {
            marketDashboard.parentNode.insertBefore(testnetContainer, marketDashboard.nextSibling);
        } else {
            // Fallback: insert after header
            const header = document.querySelector('.jumbotron');
            header.parentNode.insertBefore(testnetContainer, header.nextSibling);
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Listen for address generation from script lab
        document.addEventListener('scriptGenerated', (event) => {
            this.handleScriptGenerated(event.detail);
        });
        
        // Listen for address updates
        document.addEventListener('addressUpdated', (event) => {
            this.updateAddress(event.detail.address);
        });
    }
    
    // Handle script generation
    handleScriptGenerated(scriptData) {
        if (scriptData && scriptData.address) {
            this.updateAddress(scriptData.address);
            this.lastGeneratedScript = scriptData;
        }
    }
    
    // Update the testnet address
    updateAddress(address) {
        this.currentAddress = address;
        const addressInput = document.getElementById('testnet-address');
        if (addressInput) {
            addressInput.value = address;
            this.showNotification(`Address updated: ${address.substring(0, 20)}...`, 'success');
        }
    }
    
    // Open faucet in new window
    openFaucet(faucetType) {
        if (!this.currentAddress) {
            this.showNotification('Please generate a script first to get an address', 'warning');
            return;
        }
        
        const faucet = this.faucets.find(f => f.name.toLowerCase().includes(faucetType));
        if (faucet) {
            // Copy address to clipboard
            navigator.clipboard.writeText(this.currentAddress).then(() => {
                this.showNotification(`Address copied! Opening ${faucet.name}...`, 'info');
                
                // Open faucet in new window
                const newWindow = window.open(faucet.url, '_blank', 'width=800,height=600');
                
                if (newWindow) {
                    // Focus the new window
                    newWindow.focus();
                } else {
                    this.showNotification('Popup blocked! Please allow popups and try again.', 'warning');
                }
            }).catch(() => {
                this.showNotification('Could not copy address. Please copy manually.', 'warning');
                window.open(faucet.url, '_blank');
            });
        }
    }
    
    // Check address on explorer
    checkAddress(explorerType) {
        if (!this.currentAddress) {
            this.showNotification('Please generate a script first to get an address', 'warning');
            return;
        }
        
        const explorer = this.explorers.find(e => e.name.toLowerCase().includes(explorerType));
        if (explorer) {
            const explorerUrl = explorer.url + 'address/' + this.currentAddress;
            window.open(explorerUrl, '_blank');
            this.showNotification(`Opening ${explorer.name} explorer...`, 'info');
        }
    }
    
    // Open broadcast transaction page
    openBroadcast() {
        const broadcastUrl = 'https://blockstream.info/testnet/tx/push';
        window.open(broadcastUrl, '_blank');
        this.showNotification('Opening transaction broadcaster...', 'info');
    }
    
    // Copy testnet address to clipboard
    copyTestnetAddress() {
        if (!this.currentAddress) {
            this.showNotification('No address available. Please generate a script first.', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(this.currentAddress).then(() => {
            this.showNotification('Address copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Could not copy address. Please copy manually.', 'warning');
        });
    }
    
    // Get faucet information
    getFaucetInfo(faucetType) {
        return this.faucets.find(f => f.name.toLowerCase().includes(faucetType));
    }
    
    // Get explorer information
    getExplorerInfo(explorerType) {
        return this.explorers.find(e => e.name.toLowerCase().includes(explorerType));
    }
    
    // Show notification
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
    
    // Update testnet status
    updateStatus() {
        const statusDiv = document.getElementById('testnet-status');
        const lastUpdateDiv = document.getElementById('testnet-last-update');
        
        if (statusDiv) {
            statusDiv.innerHTML = `
                <span class="status-indicator">🟢</span>
                <span class="status-text">Testnet Helper: Ready</span>
                <span class="last-update">Last update: ${new Date().toLocaleTimeString()}</span>
            `;
        }
    }
}

// Global functions for HTML onclick handlers
let testnetHelper;

function initTestnetHelper() {
    testnetHelper = new TestnetHelper();
    testnetHelper.init();
}

function openFaucet(faucetType) {
    if (testnetHelper) {
        testnetHelper.openFaucet(faucetType);
    }
}

function checkAddress(explorerType) {
    if (testnetHelper) {
        testnetHelper.checkAddress(explorerType);
    }
}

function openBroadcast() {
    if (testnetHelper) {
        testnetHelper.openBroadcast();
    }
}

function copyTestnetAddress() {
    if (testnetHelper) {
        testnetHelper.copyTestnetAddress();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTestnetHelper();
});
