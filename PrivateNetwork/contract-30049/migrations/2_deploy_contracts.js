// const HelloWorld = artifacts.require("./HelloWorld");

// module.exports = function(deployer) {
//     deployer.deploy(HelloWorld);
// };

const ProMinTrader = artifacts.require("ProMinTrader");

module.exports = function(deployer) {
    deployer.deploy(ProMinTrader);
};