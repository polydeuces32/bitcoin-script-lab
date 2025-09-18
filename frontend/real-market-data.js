// Bitcoin Script Learning Lab - Real Market Data Integration
// This file shows how to integrate with real market data APIs

class RealMarketData {
    constructor() {
        this.apiKeys = {
            // In production, these would be environment variables
            coinGecko: 'your-coingecko-api-key',
            federalReserve: 'your-federal-reserve-api-key',
            coinMarketCap: 'your-coinmarketcap-api-key'
        };
        this.endpoints = {
            coinGecko: 'https://api.coingecko.com/api/v3',
            federalReserve: 'https://api.stlouisfed.org/fred',
            coinMarketCap: 'https://pro-api.coinmarketcap.com/v1'
        };
    }

    // Get real Bitcoin data from CoinGecko
    async getBitcoinData() {
        try {
            const response = await fetch(`${this.endpoints.coinGecko}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
            const data = await response.json();
            
            return {
                price: data.bitcoin.usd,
                marketCap: data.bitcoin.usd_market_cap,
                change24h: data.bitcoin.usd_24h_change
            };
        } catch (error) {
            console.error('Error fetching Bitcoin data:', error);
            return this.getMockBitcoinData();
        }
    }

    // Get real Ethereum data from CoinGecko
    async getEthereumData() {
        try {
            const response = await fetch(`${this.endpoints.coinGecko}/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
            const data = await response.json();
            
            return {
                price: data.ethereum.usd,
                marketCap: data.ethereum.usd_market_cap,
                change24h: data.ethereum.usd_24h_change
            };
        } catch (error) {
            console.error('Error fetching Ethereum data:', error);
            return this.getMockEthereumData();
        }
    }

    // Get real Solana data from CoinGecko
    async getSolanaData() {
        try {
            const response = await fetch(`${this.endpoints.coinGecko}/simple/price?ids=solana&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
            const data = await response.json();
            
            return {
                price: data.solana.usd,
                marketCap: data.solana.usd_market_cap,
                change24h: data.solana.usd_24h_change
            };
        } catch (error) {
            console.error('Error fetching Solana data:', error);
            return this.getMockSolanaData();
        }
    }

    // Get M2 Money Supply from Federal Reserve (requires API key)
    async getM2MoneySupply() {
        try {
            // This would require a Federal Reserve API key
            const response = await fetch(`${this.endpoints.federalReserve}/series/observations?series_id=M2SL&api_key=${this.apiKeys.federalReserve}&file_type=json&limit=1&sort_order=desc`);
            const data = await response.json();
            
            if (data.observations && data.observations.length > 0) {
                const latest = data.observations[0];
                return {
                    supply: parseFloat(latest.value) / 1000, // Convert to trillions
                    date: latest.date
                };
            }
        } catch (error) {
            console.error('Error fetching M2 data:', error);
        }
        
        return this.getMockM2Data();
    }

    // Get crypto adoption metrics
    async getAdoptionMetrics() {
        try {
            // This would require multiple API calls to get real adoption data
            const [btcWallets, ethAddresses, solWallets] = await Promise.all([
                this.getBitcoinWalletCount(),
                this.getEthereumAddressCount(),
                this.getSolanaWalletCount()
            ]);

            return {
                btcWallets,
                ethAddresses,
                solWallets,
                totalUsers: btcWallets + ethAddresses + solWallets
            };
        } catch (error) {
            console.error('Error fetching adoption metrics:', error);
            return this.getMockAdoptionData();
        }
    }

    // Mock data fallbacks
    getMockBitcoinData() {
        return {
            price: 45000 + (Math.random() - 0.5) * 5000,
            marketCap: 850000000000 + (Math.random() - 0.5) * 100000000000,
            change24h: (Math.random() - 0.5) * 10
        };
    }

    getMockEthereumData() {
        return {
            price: 2800 + (Math.random() - 0.5) * 400,
            marketCap: 340000000000 + (Math.random() - 0.5) * 40000000000,
            change24h: (Math.random() - 0.5) * 10
        };
    }

    getMockSolanaData() {
        return {
            price: 120 + (Math.random() - 0.5) * 20,
            marketCap: 50000000000 + (Math.random() - 0.5) * 10000000000,
            change24h: (Math.random() - 0.5) * 10
        };
    }

    getMockM2Data() {
        return {
            supply: 20.8 + (Math.random() - 0.5) * 0.5,
            date: new Date().toISOString().split('T')[0]
        };
    }

    getMockAdoptionData() {
        return {
            btcWallets: 100 + Math.random() * 20,
            ethAddresses: 80 + Math.random() * 15,
            solWallets: 15 + Math.random() * 5,
            totalUsers: 195 + Math.random() * 40
        };
    }

    // Individual wallet count methods (would need real APIs)
    async getBitcoinWalletCount() {
        // This would require blockchain analysis APIs
        return 100 + Math.random() * 20;
    }

    async getEthereumAddressCount() {
        // This would require blockchain analysis APIs
        return 80 + Math.random() * 15;
    }

    async getSolanaWalletCount() {
        // This would require blockchain analysis APIs
        return 15 + Math.random() * 5;
    }
}

// Export for use in other files
window.RealMarketData = RealMarketData;
