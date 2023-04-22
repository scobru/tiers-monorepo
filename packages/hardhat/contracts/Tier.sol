// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Tier is Ownable {
  using SafeMath for uint256;

  address public creator;
  address public factoryContract;

  string public name;
  string public description;

  uint256 public subscriptionDuration;
  uint256 public fee;
  uint256 public subscribeCount;
  uint256 public totalFeeCreator;

  string private tierCid;

  mapping(address => uint256) public lastPaymentTime;

  event SubscriptionRenewed(address indexed subscriber, uint256 payment, uint256 nextPaymentTime);

  constructor(
    address _creator,
    string memory _name,
    string memory _description,
    uint256 _fee,
    uint256 _subscriptionDuration
  ) {
    creator = _creator;
    name = _name;
    description = _description;
    fee = _fee;
    subscriptionDuration = _subscriptionDuration;
    factoryContract = msg.sender;

    transferOwnership(_creator);
  }

  function initialize(
    address _creator,
    string memory _name,
    string memory _description,
    uint256 _fee,
    uint256 _subscriptionDuration
  ) public {
    require(msg.sender == address(factoryContract), "Only Factory contract can call this");

    creator = _creator;
    name = _name;
    description = _description;
    fee = _fee;
    subscriptionDuration = _subscriptionDuration;
    factoryContract = msg.sender;
  }

  function subscribe() public payable {
    require(msg.value == fee, "Incorrect payment amount");
    require(lastPaymentTime[msg.sender] + subscriptionDuration <= block.timestamp, "Subscription still active");

    subscribeCount++;
    uint256 feeAmount = (msg.value * 100) / 10000;

    payable(factoryContract).transfer(feeAmount);

    uint256 amountAfter = msg.value - feeAmount;
    totalFeeCreator += amountAfter;

    payable(creator).transfer(amountAfter);

    lastPaymentTime[msg.sender] = block.timestamp;
    uint256 nextPaymentTime = block.timestamp + subscriptionDuration;

    emit SubscriptionRenewed(msg.sender, amountAfter, nextPaymentTime);
  }

  function changeMonthlyFee(uint256 newFee) external onlyOwner {
    fee = newFee;
  }

  function changeName(string memory newName) external onlyOwner {
    name = newName;
  }

  function changeDescription(string memory newDescription) external onlyOwner {
    description = newDescription;
  }

  function changeFee(uint256 newFee) external onlyOwner {
    fee = newFee;
  }

  function changeSubscriptionDuration(uint256 newSubscriptionDuration) external onlyOwner {
    subscriptionDuration = newSubscriptionDuration;
  }

  function getSubscriptionStatus(address subscriber) public view returns (bool) {
    if (lastPaymentTime[subscriber] + subscriptionDuration > block.timestamp) {
      return true;
    } else {
      return false;
    }
  }

  function setTierCid(string memory _tierCid) public onlyOwner {
    tierCid = _tierCid;
  }

  function getTierCid(address _addr) external view returns (string memory) {
    if (lastPaymentTime[_addr] + subscriptionDuration > block.timestamp) {
      return tierCid;
    } else {
      return "0x00";
    }
  }
}
