// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract CryptoGacha {
    string public name = "CryptoGacha";
    string public ticker = "CGC";
    address owner;

    mapping(address => uint) public balances;

    constructor() {
        balances[msg.sender] = 10000000000000000000000000000;
        owner = msg.sender;
    }

    function transferAmount(address recipient, uint amount) public {
        require(balances[msg.sender] >= amount);

        balances[recipient] += amount;
        balances[msg.sender] -= amount;
    }

    function buyRSC() public payable {
        balances[msg.sender] += msg.value; // mint RSC
    }

    function withdrawAll() public {
        address payable toWithdraw = payable(owner);

        toWithdraw.transfer(address(this).balance);
    }

    function getEtherBalance(address userWallet) view public returns (uint) {
        return userWallet.balance;
    }
