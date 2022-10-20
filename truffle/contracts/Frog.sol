// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Frog is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _customBaseURI;
    uint256 private _price;

    constructor(string memory customBaseURI_) ERC721("RandomNFT", "YGBS") {
        _customBaseURI = customBaseURI_;
        _price = 0.05 ether;
        
    }

    function setBaseURI(string memory customBaseURI_) public onlyOwner
    {
        _customBaseURI = customBaseURI_;
    }

    function purchase(uint256 quantity) public payable returns (uint256)
    {   
        require(msg.value >= _price, "Not enough ETH sent");
        payable(owner()).transfer(_price);
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        return newItemId;
    }

    function _baseURI() internal view virtual override returns(string memory)
    {
        return _customBaseURI;
    }
}
