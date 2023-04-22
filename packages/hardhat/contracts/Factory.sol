// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Factory is Ownable {
  struct ContractInfo {
    address contractAddress;
    address creator;
    bool isActive;
  }

  uint256 public contractCounter;

  uint256 public creationFee;

  address[] public contracts;

  mapping(address => ContractInfo) public createdContracts;

  event ContractCreated(address indexed contractAddress, address indexed creator);

  constructor(uint256 _creationFee) {
    creationFee = _creationFee;
    _transferOwnership(msg.sender);
  }

  function createContract(address _creator) public payable returns (address) {
    require(msg.value == getCreationFee(), "fee is not correct");
    payable(owner()).transfer(msg.value);

    contractCounter++;

    address newContract = _createContract(_creator);

    contracts.push(newContract);

    createdContracts[newContract] = ContractInfo({contractAddress: newContract, creator: _creator, isActive: true});

    emit ContractCreated(newContract, _creator);

    return newContract;
  }

  function _createContract(address creator) internal virtual returns (address);

  function getContracts() public view returns (address[] memory) {
    return contracts;
  }

  function getContractsOwnedBy(address owner) public view returns (address[] memory) {
    uint256 count = 0;
    for (uint256 i = 0; i < contracts.length; i++) {
      if (createdContracts[contracts[i]].creator == owner) {
        count++;
      }
    }
    address[] memory ownedContracts = new address[](count);
    uint256 j = 0;
    for (uint256 i = 0; i < contracts.length; i++) {
      if (createdContracts[contracts[i]].creator == owner) {
        ownedContracts[j] = contracts[i];
        j++;
      }
    }
    return ownedContracts;
  }

  function deactivateContract(address contractAddress) public onlyOwner {
    createdContracts[contractAddress].isActive = false;
  }

  function activateContract(address contractAddress) public onlyOwner {
    createdContracts[contractAddress].isActive = true;
  }

  function isContractCreated(address contractAddress) public view returns (bool) {
    return createdContracts[contractAddress].isActive;
  }

  function getCreationFee() public view returns (uint256) {
    return creationFee;
  }

  function withdrawETH() public onlyOwner {
    payable(msg.sender).transfer(address(this).balance);
  }

  receive() external payable {}
}
