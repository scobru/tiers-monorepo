import React from "react";
import { useDeployedContractInfo, useScaffoldContractWrite, useScaffoldEventSubscriber } from "../hooks/scaffold-eth";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import type { NextPage } from "next";
import { useAccount, useBalance, useContractRead, useSigner } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const Tiers: NextPage = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [subscriptions, setSubscriptions] = React.useState<Array<string>>([]);
  const [subscriptionName, setSubscriptionName] = React.useState("");
  const [subscriptionDescription, setSubscriptionDescription] = React.useState("0");
  const [subscriptionFee, setSubscriptionFee] = React.useState("0");
  const [subscriptionDuration, setSubscriptionDuration] = React.useState("");
  const [totalSubscriptions, setTotalSubscriptions] = React.useState(0);
  const deployedContractFactory = useDeployedContractInfo("TierFactory");

  const { data: _fee } = useContractRead({
    address: deployedContractFactory.data?.address,
    abi: deployedContractFactory?.data?.abi,
    functionName: "creationFee",
  });

  const { data: _subscriptions } = useContractRead({
    address: deployedContractFactory.data?.address,
    abi: deployedContractFactory?.data?.abi,
    functionName: "getContractsOwnedBy",
    args: [String(address)],
  });

  const { data: _totalSubscritption } = useContractRead({
    address: deployedContractFactory.data?.address,
    abi: deployedContractFactory?.data?.abi,
    functionName: "getContracts",
    args: [],
  });

  const { data: _owner } = useContractRead({
    address: deployedContractFactory.data?.address,
    abi: deployedContractFactory?.data?.abi,
    functionName: "owner",
  });

  const { data: _contractBalance } = useBalance({
    address: deployedContractFactory.data?.address,
  });

  const getContractData = async function getContractData() {
    if (address) {
      try {
        let _sub: any = [];
        _sub = _subscriptions?.filter((feed: string) => feed != "0x0000000000000000000000000000000000000000");
        setTotalSubscriptions(_totalSubscritption);
        setSubscriptions(_sub);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const createSubscriptionWrite: any = useScaffoldContractWrite({
    contractName: "TierFactory",
    functionName: "createTier",
    args: [
      subscriptionName,
      subscriptionDescription,
      parseEther(subscriptionFee),
      BigNumber.from(Number(subscriptionDuration)),
    ],
    value: String(Number(_fee) / 1e18 > 0 ? String(Number(_fee) / 1e18) : String(0)),
  });

  const createSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSubscriptionWrite.writeAsync?.();
  };

  const withdrawETH = useScaffoldContractWrite({
    contractName: "TierFactory",
    functionName: "withdrawETH",
  });

  useScaffoldEventSubscriber({
    contractName: "TierFactory",
    eventName: "ContractCreated",
    listener: (creator: string, contract: string) => {
      notification.success("Subscription Created");
      console.log(creator, contract);
    },
  });

  React.useEffect(() => {
    getContractData();
  }, [signer, address, _subscriptions]);

  return (
    <div className="flex w-2/3 flex-col mx-auto flex-grow pt-10 text-base-content">
      <div className="min-w-full">
        <div className="text-xl mb-2">
          <div className="text-base-content font-bold mb-2 p-2">Protocol Fee</div>
          <div className="text-base-content p-2">{_fee ? `${formatEther(String(_fee))} MATIC` : "-"}</div>
        </div>
        <div className="flex flex-col items-center text-center justify-center w-full mx-auto max-w-md p-10 px-20 mb-2 ">
          <h2 className="text-lg font-medium">Tiers</h2>
          {subscriptions &&
            subscriptions.map((subscription, index) => (
              <div
                key={index}
                className="card bg-secondary hover:bg-accent text-xl text-base-content py-2 px-2 mx-2 font-semibold"
              >
                <a href={`/viewTier?addr=${subscription}`} className="text-base hover:text-indigo-900">
                  {subscription}
                </a>
              </div>
            ))}
        </div>
      </div>
      <div className="card w-full mx-auto text-base-content  items-center  shadow-2xl shadow-black px-5 py-5 mb-20 border-2 border-primary">
        <h1 className="card-title text-base-content text-4xl text-left">Create Tier</h1>
        <form onSubmit={createSubscription} className="text-secondary w-full my-2">
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
            Subscription Duration in seconds{" "}
          </label>
          <input
            type="text"
            name="subscriptionDuration"
            id="subscriptionDuration"
            className="text-base-content input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={e => setSubscriptionDuration(String(e.target.value))}
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
              className="btn-wide text-center items-center justify-center text-base-content bg-primary hover:bg-accent hover:text-accent-content font-bold py-2 px-4 my-5 rounded-md hover:"
            >
              Create Subscription
            </button>
          </div>
        </form>
        {address == _owner ? (
          <div className="card min-w-fit mx-auto text-base-content  items-center  shadow-2xl px-5 py-5 mb-20">
            ETH Balance : {_contractBalance?.formatted}
            <button
              type="submit"
              className="btn-wide text-center items-center justify-center text-base-content bg-primary hover:bg-accent hover:text-accent-content font-bold py-2 px-4 my-5 rounded-md"
              onClick={withdrawETH.writeAsync}
            >
              Withdraw ETH
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tiers;
