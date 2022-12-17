require('dotenv').config()
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");


task("accounts", "👩🕵👨🙋👷 Prints the list of a ccounts (only for localhost)", async () => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  console.log("👩🕵 👨🙋👷 these accounts only for localhost network.");
  console.log('To see their private keys🔑🗝 when you run "npx hardhat node."');
});

module.exports = {
  etherscan: {
    apiKey: process.env.ethAPIKey
  },
      
  defaultNetwork: "hardhat", 
  
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000",
        count: 10,
      }
    },
    
    localhost: {
      url: "http://127.0.0.1:8545"
    },

    Ganache: {
      url: "http://127.0.0.1:7545"
    },
//0x2fEf339746D24730e8D1A56B2FB4F0Ca10Ac29ac
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },


    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 4,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },

    ropsten: {
      url: "https://ropsten.infura.io/v3/eda0fb7cf9a74e019cb6d55e21dace15",
      chainId: 3,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },

    goerli: {
              url: "https://goerli.infura.io/v3/309820d3955640ec9cda472d998479ef",
              chainId: 5,
              accounts: [process.env.privateKey],
      },

    maticTestnet: {
      url: "https://rpc-mumbai.matic.today",
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },

    milkomeda: {
      url: "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
      chainId: 200101,
      gasPrice: 2000000000000,
      accounts: [process.env.privateKey]
    }
  },

  gasReporter: {
    enabled: false
  },

  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
    overrides: {
      "contracts/test/USDT.sol": {
        version: "0.4.18",
      },
      "contracts/test/BUSD.sol": {
        version: "0.5.16",
      },
      "contracts/uniswap/core/*.sol": {
        version: "0.5.16",
      },
      "contracts/uniswap/periphery/*.sol": {
        version: "0.6.6",
      },
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  mocha: {
    timeout: 2000000
  },
};
