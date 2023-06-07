// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GachaCryptoCoin {
    string public constant name = "GachaCryptoCoin";
    string public constant symbol = "GCG";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    address public contractAdress = getContractAddress();
    address public contractOwner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10**uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        contractOwner = msg.sender;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(value <= balanceOf[msg.sender], "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(value <= balanceOf[from], "Insufficient balance");
        require(value <= allowance[from][contractAdress], "Insufficient allowance");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][contractAdress] -= value;
        emit Transfer(from, to, value);

        return true;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function approveContract(uint256 value) external returns (bool) {
        allowance[contractOwner][contractAdress] = value;
        emit Approval(contractOwner, contractAdress, value);
        return true;
    }


    function getRandomAmount(uint256 gachaerMoney) public view returns (uint) {
        uint randomHash = uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp)));
        return randomHash % ((gachaerMoney*2) );
    }

    function giveGachaerHisMoney(address to, uint256 value) external returns (bool) {
        address from = contractOwner;
        require(to != address(0), "Invalid recipient");
        require(value <= balanceOf[from], "Insufficient balance");
        require(value <= allowance[from][contractAdress], "Insufficient allowance");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][contractAdress] -= value;
        emit Transfer(from, to, value);

        return true;
    }


    function buyCoin(uint256 amount) public {
        require(amount <= 100000);
        require(balanceOf[contractOwner] >= amount);
        balanceOf[msg.sender] += amount* 10**uint256(decimals);
        balanceOf[contractOwner] -= amount* 10**uint256(decimals);
    }
}