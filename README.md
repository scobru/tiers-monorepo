# TIERS ⨇

Tiers is a subscriptions protocol that allows users to create their own subscription selecting fee, duration and secret content that only subscribers can access.

## Contracts

[Tiers.sol](packages/hardhat/contracts/Tiers.sol): This is the core Subscription Contract  
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
