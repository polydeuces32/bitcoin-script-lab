// Bitcoin Script Library & Marketplace
class ScriptLibrary {
    constructor() {
        this.scripts = [];
        this.categories = ['Security', 'Business', 'DeFi', 'Advanced', 'Custom'];
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        this.initLibrary();
    }
    
    initLibrary() {
        this.loadScriptLibrary();
        this.setupEventListeners();
        this.displayScripts();
    }
    
    loadScriptLibrary() {
        this.scripts = [
            {
                id: 'script_001',
                name: '2-of-3 Multisig Escrow',
                description: 'Perfect for online purchases with dispute resolution',
                category: 'Business',
                difficulty: 'Beginner',
                rating: 4.8,
                downloads: 1250,
                author: 'BitcoinScriptLab',
                script: `OP_2
<buyer_pubkey>
<seller_pubkey>
<arbitrator_pubkey>
OP_3
OP_CHECKMULTISIG`,
                useCase: 'Online marketplace escrow',
                tags: ['multisig', 'escrow', 'dispute-resolution'],
                createdAt: '2024-01-15'
            },
            {
                id: 'script_002',
                name: 'Time-Locked Inheritance',
                description: 'Funds locked until specific time for estate planning',
                category: 'Security',
                difficulty: 'Intermediate',
                rating: 4.6,
                downloads: 890,
                author: 'EstatePlanner',
                script: `<locktime>
OP_CHECKLOCKTIMEVERIFY
OP_DROP
<heir_pubkey>
OP_CHECKSIG`,
                useCase: 'Estate planning and inheritance',
                tags: ['timelock', 'inheritance', 'estate'],
                createdAt: '2024-01-20'
            },
            {
                id: 'script_003',
                name: 'Atomic Swap Hash Lock',
                description: 'Cross-chain atomic swaps using hash locks',
                category: 'DeFi',
                difficulty: 'Advanced',
                rating: 4.9,
                downloads: 2100,
                author: 'DeFiMaster',
                script: `OP_SHA256
<secret_hash>
OP_EQUALVERIFY
<trader_pubkey>
OP_CHECKSIG`,
                useCase: 'Cross-chain atomic swaps',
                tags: ['hashlock', 'atomic-swap', 'defi'],
                createdAt: '2024-01-25'
            },
            {
                id: 'script_004',
                name: 'Lightning Payment Channel',
                description: 'Off-chain payment channel for instant transactions',
                category: 'Advanced',
                difficulty: 'Expert',
                rating: 4.7,
                downloads: 1800,
                author: 'LightningDev',
                script: `OP_2
<alice_pubkey>
<bob_pubkey>
OP_2
OP_CHECKMULTISIG
OP_IF
<penalty_clause>
OP_ELSE
<timeout_clause>
OP_ENDIF`,
                useCase: 'Lightning Network payment channels',
                tags: ['lightning', 'payment-channel', 'off-chain'],
                createdAt: '2024-02-01'
            },
            {
                id: 'script_005',
                name: 'DAO Voting Mechanism',
                description: 'Decentralized governance voting system',
                category: 'DeFi',
                difficulty: 'Advanced',
                rating: 4.5,
                downloads: 950,
                author: 'GovernanceGuru',
                script: `OP_3
<proposal_hash>
<voter_pubkey_1>
<voter_pubkey_2>
<voter_pubkey_3>
OP_3
OP_CHECKMULTISIG`,
                useCase: 'Decentralized autonomous organization voting',
                tags: ['dao', 'governance', 'voting'],
                createdAt: '2024-02-05'
            },
            {
                id: 'script_006',
                name: 'Subscription Payment',
                description: 'Recurring payment mechanism for services',
                category: 'Business',
                difficulty: 'Intermediate',
                rating: 4.3,
                downloads: 750,
                author: 'SaaSBuilder',
                script: `<subscription_period>
OP_CHECKLOCKTIMEVERIFY
OP_DROP
<service_provider_pubkey>
OP_CHECKSIG`,
                useCase: 'Recurring subscription payments',
                tags: ['subscription', 'recurring', 'payments'],
                createdAt: '2024-02-10'
            }
        ];
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('script-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.displayScripts();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.displayScripts();
            });
        }
    }
    
    displayScripts() {
        const container = document.getElementById('script-library-container');
        if (!container) return;
        
        const filteredScripts = this.getFilteredScripts();
        
        if (filteredScripts.length === 0) {
            container.innerHTML = '<div class="text-muted text-center p-4">No scripts found matching your criteria</div>';
            return;
        }
        
        let html = '<div class="row">';
        
        filteredScripts.forEach(script => {
            html += this.createScriptCard(script);
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    getFilteredScripts() {
        return this.scripts.filter(script => {
            const matchesCategory = this.currentFilter === 'all' || script.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                script.name.toLowerCase().includes(this.searchQuery) ||
                script.description.toLowerCase().includes(this.searchQuery) ||
                script.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            
            return matchesCategory && matchesSearch;
        });
    }
    
    createScriptCard(script) {
        const difficultyColors = {
            'Beginner': 'success',
            'Intermediate': 'warning',
            'Advanced': 'danger',
            'Expert': 'dark'
        };
        
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card script-card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${script.name}</h6>
                        <span class="badge bg-${difficultyColors[script.difficulty]}">${script.difficulty}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${script.description}</p>
                        
                        <div class="script-meta mb-3">
                            <div class="row">
                                <div class="col-6">
                                    <small class="text-muted">Category:</small><br>
                                    <span class="badge bg-primary">${script.category}</span>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Rating:</small><br>
                                    <div class="rating">
                                        ${this.generateStars(script.rating)}
                                        <span class="ms-1">(${script.rating})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="script-stats mb-3">
                            <div class="row">
                                <div class="col-6">
                                    <small class="text-muted">Downloads:</small><br>
                                    <strong>${script.downloads.toLocaleString()}</strong>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Author:</small><br>
                                    <strong>${script.author}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="script-tags mb-3">
                            ${script.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                        </div>
                        
                        <div class="script-actions">
                            <button class="btn btn-primary btn-sm me-2" onclick="viewScript('${script.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-success btn-sm me-2" onclick="useScript('${script.id}')">
                                <i class="fas fa-download"></i> Use
                            </button>
                            <button class="btn btn-outline-primary btn-sm" onclick="forkScript('${script.id}')">
                                <i class="fas fa-code-branch"></i> Fork
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-muted"></i>';
        }
        
        return stars;
    }
    
    viewScript(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;
        
        this.showScriptModal(script);
    }
    
    showScriptModal(script) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${script.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h6>Script Code:</h6>
                                <pre class="script-code"><code>${script.script}</code></pre>
                                
                                <h6 class="mt-3">Use Case:</h6>
                                <p>${script.useCase}</p>
                            </div>
                            <div class="col-md-4">
                                <h6>Details:</h6>
                                <div class="script-details">
                                    <div class="mb-2">
                                        <strong>Category:</strong> ${script.category}
                                    </div>
                                    <div class="mb-2">
                                        <strong>Difficulty:</strong> ${script.difficulty}
                                    </div>
                                    <div class="mb-2">
                                        <strong>Rating:</strong> ${this.generateStars(script.rating)} (${script.rating})
                                    </div>
                                    <div class="mb-2">
                                        <strong>Downloads:</strong> ${script.downloads.toLocaleString()}
                                    </div>
                                    <div class="mb-2">
                                        <strong>Author:</strong> ${script.author}
                                    </div>
                                    <div class="mb-2">
                                        <strong>Created:</strong> ${script.createdAt}
                                    </div>
                                </div>
                                
                                <h6 class="mt-3">Tags:</h6>
                                <div class="script-tags">
                                    ${script.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" onclick="useScript('${script.id}')">Use This Script</button>
                        <button type="button" class="btn btn-primary" onclick="forkScript('${script.id}')">Fork Script</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    useScript(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;
        
        // Load script into the editor
        if (window.scriptEditor) {
            window.scriptEditor.editor.setValue(script.script);
            window.scriptEditor.currentScript = script.script;
            window.scriptEditor.updateScriptStatus();
        }
        
        // Scroll to editor
        document.getElementById('script-editor').scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification(`"${script.name}" loaded into editor`, 'success');
        
        // Increment download count
        script.downloads++;
    }
    
    forkScript(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;
        
        // Create a fork of the script
        const forkedScript = {
            ...script,
            id: 'script_' + Date.now(),
            name: script.name + ' (Fork)',
            author: 'You',
            downloads: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        this.scripts.unshift(forkedScript);
        this.displayScripts();
        
        this.showNotification(`Forked "${script.name}" successfully`, 'success');
    }
    
    addCustomScript() {
        const form = document.getElementById('custom-script-form');
        const formData = new FormData(form);
        
        const newScript = {
            id: 'script_' + Date.now(),
            name: formData.get('script-name'),
            description: formData.get('script-description'),
            category: formData.get('script-category'),
            difficulty: formData.get('script-difficulty'),
            rating: 0,
            downloads: 0,
            author: 'You',
            script: formData.get('script-code'),
            useCase: formData.get('script-use-case'),
            tags: formData.get('script-tags').split(',').map(tag => tag.trim()),
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        this.scripts.unshift(newScript);
        this.displayScripts();
        
        // Clear form
        form.reset();
        
        this.showNotification(`"${newScript.name}" added to library`, 'success');
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
let scriptLibrary;

function initScriptLibrary() {
    scriptLibrary = new ScriptLibrary();
}

function viewScript(scriptId) {
    if (scriptLibrary) {
        scriptLibrary.viewScript(scriptId);
    }
}

function useScript(scriptId) {
    if (scriptLibrary) {
        scriptLibrary.useScript(scriptId);
    }
}

function forkScript(scriptId) {
    if (scriptLibrary) {
        scriptLibrary.forkScript(scriptId);
    }
}

function addCustomScript() {
    if (scriptLibrary) {
        scriptLibrary.addCustomScript();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initScriptLibrary();
});
