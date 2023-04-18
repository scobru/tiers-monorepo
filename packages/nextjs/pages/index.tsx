import type { NextPage } from "next";
import Image from "next/image";
import { useContract, useProvider, useNetwork, useSigner } from "wagmi";
import { useDeployedContractInfo } from "../hooks/scaffold-eth";
import { ContractInterface } from "ethers";
import { notification } from "~~/utils/scaffold-eth";
import { Buffer } from "buffer";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import React from "react";
import { isBoolean } from "util";

/* configure Infura auth settings */
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const projectGateway = process.env.IPFS_GATEWAY;
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const DEBUG = true;

type nftMetadata = {
  name: string;
  image: string;
  description: string;
  owner: string;
};

type ImageProps = {
  cid: string;
};

const Tiers: NextPage = () => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [fee, setFee] = React.useState(0);

  const [subscriptions, setSubscriptions] = React.useState<Array<string>>([]);
  const [subscriptionName, setSubscriptionName] = React.useState("");
  const [subscriptionDescription, setSubscriptionDescription] = React.useState("");
  const [subscriptionFee, setSubscriptionFee] = React.useState("");
  const [subscriptionDuration, setSubscriptionDuration] = React.useState(0);
  const [owner, setOwner] = React.useState("");
  const [contractBalance, setContractBalance] = React.useState("");
  const [signerAddress, setSignerAddress] = React.useState("");

  const deployedContractFactory = useDeployedContractInfo("TierFactory");

  let factoryAddress!: string;

  let factoryAbi!: [];

  if (deployedContractFactory) {
    deployedContractFactory.data?.address && (factoryAddress = deployedContractFactory.data.address);
  }

  const factory = useContract({
    address: factoryAddress,
    abi: deployedContractFactory.data?.abi,
    signerOrProvider: signer || provider,
  });

  const getContractData = async function getContractData() {
    if (factory && signer) {
      const subscriptions = await factory?.getContractsOwnedBy(await signer?.getAddress());
      const _sub = subscriptions.filter(
        (feed: string) => subscriptions != "0x0000000000000000000000000000000000000000",
      );
      const fee = await factory?.creationFee();
      setSubscriptions(_sub);
      setFee(fee);
      const owner = await factory?.owner();
      setOwner(owner);
      const _constractBalance = await factory?.balance;
      setContractBalance(Number(_constractBalance));
      setSignerAddress(await signer?.getAddress());

    }
  };

  const createMecenateSubscription = async function createMecenateSubscription() {
    event?.preventDefault();
    if (factory) {
      const tx = await factory.createTier(
        subscriptionName,
        subscriptionDescription,
        parseEther(subscriptionFee),
        subscriptionDuration,
        {
          value: fee,
        },
      );
      if (tx.hash) {
        notification.success("Mecenate Subscription Started");
      }
    }
  };

  const withdrawETH = async function withdrawETH() {
    const tx = await ctx?.withdrawETH();
    await tx.wait();
  };

  // fetch smart contract event with wagmi

  React.useEffect(() => {
    if (factory) {
      factory.on("MecenateSubscriptionCreated", (owner: string, subscription: string, event: any) => {
        notification.success("Mecenate Subscription Created");
      });
    }
    getContractData();

  }, [signer, factory]);

  return (
    <div className="flex min-w-fit flex-col mx-auto flex-grow pt-10 text-base-content">
      <div className="max-w-3xl text-center my-2">

        <h1 className="text-center mb-8">
          <span className="block text-6xl font-bold">⨇ T I E R S </span>
          {/*           <Image width={200} height={200} src="/assets/logo.png" alt="Lines Logo" className="w-1/4 mx-auto my-5" />
 */}        </h1>
        <h1 className="text-4xl font-bold mb-20">
          Monetize your products, DApps, or content with our Tier Subscription
        </h1>
        <p className="text-xl  mb-2">
          Increase user loyalty by offering premium content and exclusive rewards to subscribers, unlocking a new
          revenue stream for your business. Try our Patreon-like service now and enjoy guaranteed, recurring income for
          your app
        </p>
      </div>

      <div className="min-w-fit">
        <div className="text-xl mb-8">
          <div className="text-base-content font-bold mb-2 p-2">Protocol Fee</div>
          <div className="text-base-content p-2">{fee ? `${formatEther(String(fee))} ETH` : "-"}</div>
        </div>
        <div className="card min-w-fit mx-auto text-base-content  items-center  shadow-2xl px-5 py-5 mb-20">
          <h1 className="card-title text-base-content text-4xl text-left">Create Tier</h1>
          <form onSubmit={createMecenateSubscription} className="text-secondary w-full my-2">
            <label htmlFor="name" className="block font-medium text-base-content">
              Subscription Name{" "}
            </label>
            <input
              type="text"
              name="subscriptionName"
              id="subscriptionName"
              className="text-base-content input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={e => setSubscriptionName(e.target.value)}
            />
            <label htmlFor="name" className="block font-medium text-base-content">
              Subscription Description{" "}
            </label>
            <input
              type="text"
              name="subscriptionDescription"
              id="subscriptionDescription"
              className="text-base-content input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={e => setSubscriptionDescription(e.target.value)}
            />
            <label htmlFor="name" className="block font-medium text-base-content">
              Subscription Duration{" "}
            </label>
            <input
              type="text"
              name="subscriptionDuration"
              id="subscriptionDuration"
              className="text-base-content input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={e => setSubscriptionDuration(Number(e.target.value))}
            />
            <label htmlFor="name" className="block font-medium text-base-content">
              Subscription Fee{" "}
            </label>{" "}
            <input
              type="text"
              name="subscriptionFee"
              id="subscriptionfee"
              className="text-base-content input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={e => setSubscriptionFee(e.target.value)}
            />
            <div className="text-center">
              <button
                type="submit"
                className="btn-wide text-center items-center justify-center text-base-content bg-primary hover:bg-accent font-bold py-2 px-4 my-5 rounded-md"
              >
                Create Subscription
              </button>
            </div>
          </form>
          <div className="flex flex-col items-center justify-center w-full max-w-md p-10 px-20   mt-6">
            <h2 className="text-lg font-medium">Mecenate Tiers</h2>
            {subscriptions &&
              subscriptions.map((subscription, index) => (
                <div
                  key={index}
                  className="card bg-secondary hover:bg-accent text-xl text-base-content py-2 px-2 mx-2 font-semibold"
                >
                  <a href={`/viewTier?addr=${subscription}`} className="text-indigo-600 hover:text-indigo-900">
                    {subscription}
                  </a>
                </div>
              ))}
          </div>

        </div>
        {signerAddress == owner ?
          <div className="card min-w-fit mx-auto text-base-content  items-center  shadow-2xl px-5 py-5 mb-20">
            ETH Balance : {contractBalance ? `${formatEther(String(contractBalance))} ETH` : "-"}
            <button
              type="submit"
              className="btn-wide text-center items-center justify-center text-base-content bg-primary hover:bg-accent font-bold py-2 px-4 my-5 rounded-md"
              onClick={withdrawETH}
            >
              Withdraw ETH
            </button>
          </div>
          : null
        }
      </div>
    </div>
  );
};

export default Tiers;
