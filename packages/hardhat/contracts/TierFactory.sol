// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Tier.sol";
import "@scobru/buidllib/contracts/factories/FactoryFixedFee.sol";

contract TierFactory is FactoryFixedFee {
  constructor(address _owner, uint256 _fixedFee) FactoryFixedFee(_owner, _fixedFee) {
    _transferOwnership(_owner);
  }

  function createContract(
    address creator,
    string memory name,
    string memory description,
    uint256 fee,
    uint256 subscriptionDuration
  ) public payable returns (address) {
    Tier tier = new Tier(creator, name, description, fee, subscriptionDuration);
    _createContract(address(tier));
    return address(tier);
  }
}
