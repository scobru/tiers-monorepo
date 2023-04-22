// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Tier.sol";
import "./Factory.sol";

contract TierFactory is Factory {
  constructor(uint256 _creationFee, address _owner) Factory(_creationFee) {
    _transferOwnership(_owner);
  }

  function _createContract(address creator) internal override returns (address) {
    Tier tier = new Tier(creator, "", "", 0, 0);
    return address(tier);
  }

  function createTier(
    string memory name,
    string memory description,
    uint256 fee,
    uint256 subscriptionDuration
  ) public payable returns (address) {
    address newContract = createContract(msg.sender);
    Tier tier = Tier(newContract);
    tier.initialize(msg.sender, name, description, fee, subscriptionDuration);
    return newContract;
  }
}
