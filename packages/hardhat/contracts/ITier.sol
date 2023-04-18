pragma solidity 0.8.19;

interface ITier {
  function isValidSubscription(address _subscriber) external view returns (bool);

  function subscribe() external payable;

  function fee() external view returns (uint256);
}
