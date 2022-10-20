const truffleAssert = require('truffle-assertions')
const Frog = artifacts.require("./Frog.sol")

contract("Frog", accounts => {
    it("allows a person to purchase 1 NFT", async () => {
        let buyer = accounts[8]
        frog = await Frog.deployed()

        await frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.05', 'ether')
        })

        owner = await frog.ownerOf(1)
        assert.equal(owner, buyer)

        token_uri = await frog.tokenURI(1)
        assert.equal(token_uri, "https://our-url.com/nfts/1")
    })
    
    it("allows the contract owner to change the baseURI", async() => {
        let buyer = accounts[8]
        frog = await Frog.deployed()

        await frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.05', 'ether')
        })

        owner = await frog.ownerOf(1)
        assert.equal(owner, buyer)

        await frog.setBaseURI('https://other3-url.com/nfts/')
        token_uri = await frog.tokenURI(1)
        assert.equal(token_uri, "https://other3-url.com/nfts/1")
    })

    it("does not allow anyone, but the contract owner to change the baseURI", async () => {
        frog = await Frog.deployed()

        await truffleAssert.reverts(frog.setBaseURI('https://attacker-url.com', {from: accounts[2] // not the owner
        }), "Ownable: caller is not the owner")
    })
})