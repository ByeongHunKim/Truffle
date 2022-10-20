const Frog = artifacts.require("./Frog.sol");

module.exports = function (deployer) {
  // deployer.deploy(Frog);
  deployer.deploy(Frog, 'https://our-url.com/nfts/');
};
