const path = require("path");

module.exports = {
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks:{
        develop: {
            port: 8545
        }
    },

    compilers: {
        solc: {
            version:"0.8.14",

            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            },
        }
    }
};