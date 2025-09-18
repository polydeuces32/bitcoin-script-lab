// Bitcoin Script Learning Lab - Market Data Dashboard
// Real-time crypto market data and M2 money supply

class MarketDataDashboard {
    constructor() {
        this.marketData = {
            btc: { price: 0, marketCap: 0, dominance: 0, adoption: 0 },
            eth: { price: 0, marketCap: 0, dominance: 0, adoption: 0 },
            sol: { price: 0, marketCap: 0, dominance: 0, adoption: 0 },
            m2: { supply: 0, growth: 0, lastUpdate: '' }
        };
        this.isUpdating = false;
        this.updateInterval = null;
    }

    // Initialize market data dashboard
    init() {
        this.createMarketDataDisplay();
        this.startDataUpdates();
        console.log('📊 Market Data Dashboard initialized');
    }

    // Create the market data display
    createMarketDataDisplay() {
        const marketContainer = document.createElement('div');
        marketContainer.id = 'market-data-dashboard';
        marketContainer.innerHTML = `
            <div class="card">
                <div class="card-header bg-dark text-white">
                    <h3 class="card-title mb-0">📊 Market Data Dashboard</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <!-- M2 Money Supply -->
                        <div class="col-md-3">
                            <div class="market-card">
                                <h5 class="text-info">M2 Money Supply</h5>
                                <div class="market-value" id="m2-supply">$0.00T</div>
                                <div class="market-change" id="m2-growth">+0.00%</div>
                                <div class="market-label">US Dollar Supply</div>
                            </div>
                        </div>
                        
                        <!-- Bitcoin -->
                        <div class="col-md-3">
                            <div class="market-card">
                                <h5 class="text-warning">Bitcoin (BTC)</h5>
                                <div class="market-value" id="btc-price">$0.00</div>
                                <div class="market-change" id="btc-change">+0.00%</div>
                                <div class="market-label">Market Cap: $0.00T</div>
                                <div class="market-label">Dominance: 0.00%</div>
                            </div>
                        </div>
                        
                        <!-- Ethereum -->
                        <div class="col-md-3">
                            <div class="market-card">
                                <h5 class="text-primary">Ethereum (ETH)</h5>
                                <div class="market-value" id="eth-price">$0.00</div>
                                <div class="market-change" id="eth-change">+0.00%</div>
                                <div class="market-label">Market Cap: $0.00T</div>
                                <div class="market-label">Dominance: 0.00%</div>
                            </div>
                        </div>
                        
                        <!-- Solana -->
                        <div class="col-md-3">
                            <div class="market-card">
                                <h5 class="text-success">Solana (SOL)</h5>
                                <div class="market-value" id="sol-price">$0.00</div>
                                <div class="market-change" id="sol-change">+0.00%</div>
                                <div class="market-label">Market Cap: $0.00B</div>
                                <div class="market-label">Dominance: 0.00%</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Adoption Metrics -->
                    <div class="row mt-3">
                        <div class="col-12">
                            <h5 class="text-info">Crypto Adoption Metrics</h5>
                            <div class="adoption-metrics">
                                <div class="metric-item">
                                    <span class="metric-label">Bitcoin Wallets:</span>
                                    <span class="metric-value" id="btc-wallets">0M</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Ethereum Addresses:</span>
                                    <span class="metric-value" id="eth-addresses">0M</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Solana Wallets:</span>
                                    <span class="metric-value" id="sol-wallets">0M</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Total Crypto Users:</span>
                                    <span class="metric-value" id="total-users">0M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Market Status -->
                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="market-status">
                                <span class="status-indicator" id="market-status">🟢</span>
                                <span class="status-text">Market Data: Live</span>
                                <span class="last-update" id="last-update">Last update: --</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after the header
        const header = document.querySelector('.jumbotron');
        header.parentNode.insertBefore(marketContainer, header.nextSibling);
    }

    // Start updating market data
    startDataUpdates() {
        this.updateMarketData();
        this.updateInterval = setInterval(() => {
            this.updateMarketData();
        }, 30000); // Update every 30 seconds
    }

    // Update market data (mock data for demo)
    async updateMarketData() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            // Simulate API calls with realistic data
            const btcData = await this.fetchCryptoData('bitcoin');
            const ethData = await this.fetchCryptoData('ethereum');
            const solData = await this.fetchCryptoData('solana');
            const m2Data = await this.fetchM2Data();

            this.updateDisplay(btcData, ethData, solData, m2Data);
        } catch (error) {
            console.error('Error updating market data:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    // Fetch crypto data (mock implementation)
    async fetchCryptoData(symbol) {
        // In a real implementation, you'd call actual APIs like CoinGecko, CoinMarketCap, etc.
        const mockData = {
            bitcoin: {
                price: 45000 + (Math.random() - 0.5) * 5000,
                marketCap: 850000000000 + (Math.random() - 0.5) * 100000000000,
                dominance: 45 + (Math.random() - 0.5) * 5,
                adoption: 100 + (Math.random() - 0.5) * 20
            },
            ethereum: {
                price: 2800 + (Math.random() - 0.5) * 400,
                marketCap: 340000000000 + (Math.random() - 0.5) * 40000000000,
                dominance: 18 + (Math.random() - 0.5) * 3,
                adoption: 80 + (Math.random() - 0.5) * 15
            },
            solana: {
                price: 120 + (Math.random() - 0.5) * 20,
                marketCap: 50000000000 + (Math.random() - 0.5) * 10000000000,
                dominance: 2 + (Math.random() - 0.5) * 1,
                adoption: 15 + (Math.random() - 0.5) * 5
            }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData[symbol];
    }

    // Fetch M2 money supply data (mock implementation)
    async fetchM2Data() {
        // In a real implementation, you'd call Federal Reserve APIs
        const mockM2Data = {
            supply: 20.8 + (Math.random() - 0.5) * 0.5, // Trillions
            growth: 2.5 + (Math.random() - 0.5) * 1.0, // Percentage
            lastUpdate: new Date().toLocaleString()
        };

        await new Promise(resolve => setTimeout(resolve, 300));
        return mockM2Data;
    }

    // Update the display with new data
    updateDisplay(btcData, ethData, solData, m2Data) {
        // Update M2 Money Supply
        document.getElementById('m2-supply').textContent = `$${m2Data.supply.toFixed(1)}T`;
        document.getElementById('m2-growth').textContent = `${m2Data.growth > 0 ? '+' : ''}${m2Data.growth.toFixed(2)}%`;
        document.getElementById('m2-growth').className = `market-change ${m2Data.growth >= 0 ? 'text-success' : 'text-danger'}`;

        // Update Bitcoin
        document.getElementById('btc-price').textContent = `$${btcData.price.toLocaleString()}`;
        document.getElementById('btc-change').textContent = `+${(Math.random() * 10 - 5).toFixed(2)}%`;
        document.getElementById('btc-change').className = `market-change ${Math.random() > 0.5 ? 'text-success' : 'text-danger'}`;
        document.querySelector('#btc-price').parentElement.querySelector('.market-label').textContent = `Market Cap: $${(btcData.marketCap / 1000000000000).toFixed(2)}T`;
        document.querySelector('#btc-price').parentElement.querySelectorAll('.market-label')[1].textContent = `Dominance: ${btcData.dominance.toFixed(1)}%`;

        // Update Ethereum
        document.getElementById('eth-price').textContent = `$${ethData.price.toLocaleString()}`;
        document.getElementById('eth-change').textContent = `+${(Math.random() * 10 - 5).toFixed(2)}%`;
        document.getElementById('eth-change').className = `market-change ${Math.random() > 0.5 ? 'text-success' : 'text-danger'}`;
        document.querySelector('#eth-price').parentElement.querySelector('.market-label').textContent = `Market Cap: $${(ethData.marketCap / 1000000000000).toFixed(2)}T`;
        document.querySelector('#eth-price').parentElement.querySelectorAll('.market-label')[1].textContent = `Dominance: ${ethData.dominance.toFixed(1)}%`;

        // Update Solana
        document.getElementById('sol-price').textContent = `$${solData.price.toFixed(2)}`;
        document.getElementById('sol-change').textContent = `+${(Math.random() * 10 - 5).toFixed(2)}%`;
        document.getElementById('sol-change').className = `market-change ${Math.random() > 0.5 ? 'text-success' : 'text-danger'}`;
        document.querySelector('#sol-price').parentElement.querySelector('.market-label').textContent = `Market Cap: $${(solData.marketCap / 1000000000).toFixed(0)}B`;
        document.querySelector('#sol-price').parentElement.querySelectorAll('.market-label')[1].textContent = `Dominance: ${solData.dominance.toFixed(1)}%`;

        // Update adoption metrics
        document.getElementById('btc-wallets').textContent = `${btcData.adoption.toFixed(0)}M`;
        document.getElementById('eth-addresses').textContent = `${ethData.adoption.toFixed(0)}M`;
        document.getElementById('sol-wallets').textContent = `${solData.adoption.toFixed(0)}M`;
        document.getElementById('total-users').textContent = `${(btcData.adoption + ethData.adoption + solData.adoption).toFixed(0)}M`;

        // Update last update time
        document.getElementById('last-update').textContent = `Last update: ${new Date().toLocaleTimeString()}`;

        // Add some visual feedback
        this.addUpdateAnimation();
    }

    // Add update animation
    addUpdateAnimation() {
        const cards = document.querySelectorAll('.market-card');
        cards.forEach(card => {
            card.classList.add('pulse');
            setTimeout(() => {
                card.classList.remove('pulse');
            }, 1000);
        });
    }

    // Stop updates
    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Initialize market data dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    const marketDashboard = new MarketDataDashboard();
    marketDashboard.init();
    console.log('📊 Market Data Dashboard loaded!');
});
