const truffleAssert = require('truffle-assertions')
const Frog = artifacts.require("./Frog.sol")

contract("Frog", accounts => {
    it("allows a person to purchase 1 NFT", async () => {
        let contract_owner = accounts[0]
        let buyer = accounts[8]
        
        frog = await Frog.deployed()

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        console.log("STARTING BALANCE: ", starting_balance);

        await frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.05', 'ether')
        })

        owner = await frog.ownerOf(1)
        assert.equal(owner, buyer)

        token_uri = await frog.tokenURI(1)
        assert.equal(token_uri, "https://our-url.com/nfts/1")

        let ending_balance = await web3.eth.getBalance(contract_owner)
        ending_balance = parseFloat(web3.utils.fromWei(ending_balance, 'ether'))

        console.log("ENDING BALANCE: ", ending_balance);

        assert.equal(ending_balance, starting_balance + 0.05)
    })

    it("allows a person to purchase several NFTs", async () => {
        let contract_owner = accounts[0]
        let buyer = accounts[7]
        
        frog = await Frog.deployed()

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))


        await frog.purchase(4, {
            from: buyer,
            value: web3.utils.toWei('0.2', 'ether')
        })

        balance = parseInt(await frog.balanceOf(buyer))
        assert.equal(balance, 4)

        let ending_balance = await web3.eth.getBalance(contract_owner)
        ending_balance = parseFloat(web3.utils.fromWei(ending_balance, 'ether'))


        assert.equal(ending_balance, starting_balance + 0.2)
    })

    it("requires the correct amount of money", async() => {
        let contract_owner = accounts[0]
        let buyer = accounts[8]
        frog = await Frog.deployed()

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        console.log("STARTING BALANCE : ", starting_balance)

        await truffleAssert.reverts(frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.02', 'ether')
        }), "Not enough ETH sent")
    })

    it("doesn't allow more than the max quantity", async () => {
        let contract_owner = accounts[0]
        let buyer = accounts[7]
        
        frog = await Frog.deployed()

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        await truffleAssert.reverts(frog.purchase(11, {
            from: buyer,
            value: web3.utils.toWei('0.55', 'ether')
        }), "Can't mint more than 10.")
    })

    it("doesn't allow more than the max quantity", async () => {
        let frog = await Frog.new('https://our-url.com/nfts/')

        let contract_owner = accounts[0]
        let buyer = accounts[7]
        
        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        await frog.purchase(2, {
            from: buyer,
            value: web3.utils.toWei('0.10', 'ether')
        })

        await frog.purchase(7, {
            from: buyer,
            value: web3.utils.toWei('0.35', 'ether')
        })

        await frog.purchase(5, {
            from: buyer,
            value: web3.utils.toWei('0.55', 'ether')
        })

        await frog.purchase(6, {
            from: buyer,
            value: web3.utils.toWei('0.55', 'ether')
        })

        await truffleAssert.reverts(frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.1', 'ether')
        }), "Project is finished minting")
    })
    
    it("allows the contract owner to change the baseURI", async() => {
        let buyer = accounts[8]
        frog = await Frog.deployed()

        await frog.purchase(1, {
            from: buyer,
            value: web3.utils.toWei('0.55', 'ether')
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