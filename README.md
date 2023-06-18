---
description: Decentralized Subscriptions
---

# Tiers ⨇

Tiers is a subscriptions protocol that allows users to create their own subscription selecting fee, duration and secret content that only subscribers can access.

## Contracts

[Tiers.sol](packages/hardhat/contracts/Tiers.sol): This is the core Subscription Contract\
[TierFactory.sol](packages/hardhat/contracts/TierFactory.sol): This contract is used to create new tiers

## Running this project

1. Clone the repository
2. Run the following command from the root of the project

```bash
yarn install
```

```bash
yarn start
```

> If you don't wish to interact with the polygon mainnet follow the steps below:

1. Clone the repository
2. In the [scaffold.config.ts](packages/nextjs/scaffold.config.ts) file change the `targetNetwork` property to `chains.hardhat`
3. Create .env file based on the .env.example file in [hardhat folder](packages/hardhat/)
4. Run the following command from the root of the project

```bash
yarn install
```

```bash
yarn fork
```

```bash
yarn start
```

## Deployments

### Polygon

* Tier: [0xFbdb3793b5a87095E6C9c1efEbE2F4442BeDD0B5](https://polygonscan.com/address/0xb6ba99ad1bf205f79540cacb6e9079711bc93a0d)
* TierFactory: [0xb6BA99AD1BF205f79540cacB6E9079711Bc93a0D](https://polygonscan.com/address/0xb6BA99AD1BF205f79540cacB6E9079711Bc93a0D)

## ITier.sol

### Read-only functions

#### getSubscriptionStatus

````solidity
function ```solidity
getSubscriptionStatus(address _subscriber) external view returns (bool);
````

This function takes an address as input and returns a boolean value indicating whether the subscriber with that address has a valid subscription. The validity of the subscription is determined by comparing the current block's timestamp to the subscription expiration timestamp stored for the subscriber.

#### fee

```solidity
function fee() external view returns (uint256);
```

This function returns the subscription fee amount required to subscribe to the service.

### Write functions

#### subscribe

```solidity
function subscribe() external payable;
```

This function allows a subscriber to subscribe to the service by sending a payment equal to the subscription fee to the contract. The function checks if the amount received is equal to the subscription fee and updates the subscriber's expiration timestamp to the current block's timestamp plus the duration of the subscription.
