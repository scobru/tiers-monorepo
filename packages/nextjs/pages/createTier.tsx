import React from "react";
import { useDeployedContractInfo, useScaffoldContractWrite, useScaffoldEventSubscriber } from "../hooks/scaffold-eth";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import type { NextPage } from "next";
import { useAccount, useBalance, useContractRead, useSigner } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { type } from "os";

const Tiers: NextPage = () => {

  type Tier = {
    name: string;
    description: string;
    fee: string;
    duration: string;
    address: string;
  };

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [subscriptions, setSubscriptions] = React.useState<Array<string>>([]);
  const [subscriptionName, setSubscriptionName] = React.useState("");
  const [subscriptionDescription, setSubscriptionDescription] = React.useState("0");
  const [subscriptionFee, setSubscriptionFee] = React.useState("0");
  const [subscriptionDuration, setSubscriptionDuration] = React.useState("");
  const [totalSubscriptions, setTotalSubscriptions] = React.useState(0);
  const deployedContractFactory = useDeployedContractInfo("TierFactory");
  const deployedContract = useDeployedContractInfo("Tier");
  const [allTiers, setAllTiers] = React.useState<Array<Tier>>([]);
  const [ownedTiers, setOwnedTiers] = React.useState<Array<Tier>>([]);
  const [showAllTiers, setShowAllTiers] = React.useState(false);

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
    if (address && signer) {
      try {
        let _sub: any = [];
        let _tier: any = [];
        let _ownedTier: any = [];

        _sub = _subscriptions?.filter((feed: string) => feed != "0x0000000000000000000000000000000000000000");

        for (let i = 0; i < _totalSubscritption?.length; i++) {
          const ctx = new ethers.Contract(_sub[i], deployedContract?.data?.abi, signer);
          const _name = await ctx.name();
          const _description = await ctx.description();
          const _fee = await ctx.fee();
          const _duration = await ctx.subscriptionDuration();
          _tier.push({
            name: _name,
            description: _description,
            fee: Number(_fee) / 1e18,
            duration: Number(Number(_duration) / 86400).toFixed(0),
            address: _sub[i],
          });
        }

        for (let i = 0; i < _sub?.length; i++) {
          const ctx = new ethers.Contract(_sub[i], deployedContract?.data?.abi, signer);
          const _name = await ctx.name();
          const _description = await ctx.description();
          const _fee = await ctx.fee();
          const _duration = await ctx.subscriptionDuration();
          _ownedTier.push({
            name: _name,
            description: _description,
            fee: Number(_fee) / 1e18,
            duration: Number(Number(_duration) / 86400).toFixed(0),
            address: _sub[i],
          });
        }


        setAllTiers(_tier);
        console.log(allTiers)
        setSubscriptions(_sub);
        setOwnedTiers(_ownedTier);
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
  }, [signer, address]);

  return (
    <div className="flex flex-col w-full px-4 md:w-2/3 md:px-0 mx-auto flex-grow pt-10 ">
      <div className="w-full">

        <button
          className="btn btn-primary"
          onClick={() => {
            getContractData();
            setShowAllTiers(!showAllTiers);

          }}
        >
          {showAllTiers ? "Owned Tiers" : "All Tiers"}
        </button>
        <div className="flex flex-col items-center text-center text-base justify-center w-full mx-auto max-w-md p-4 md:p-10 px-4 md:px-20 mb-5 mt-5">
          {subscriptions && !showAllTiers &&
            ownedTiers.map((subscription, index) => (
              <div
                key={index}
                className="card text-xl text-base-content py-2 px-2 font-semibold"
              >
                <div className="text-3xl font-extrabold mb-10">
                  Owned
                </div>
                <table className="table-auto w-full text-left whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Fee</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions &&
                      ownedTiers.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <a href={`/viewTier?addr=${item.address}`} className=" text-xl capitalize underline hover:text-indigo-900">
                              {item.name}
                            </a></td>
                          <td className="px-4 py-2">{item.fee} MATIC</td>
                          <td className="px-4 py-2">{item.duration} days</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          {subscriptions && showAllTiers &&
            allTiers.map((item, index) => (
              <div
                key={index}
                className="card text-xl text-base-content py-2 px-2 font-semibold"
              >
                <div className="text-3xl font-extrabold mb-10">
                  All Tiers
                </div>
                <table className="table-auto w-full text-left whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Fee</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions &&
                      allTiers.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <a href={`/viewTier?addr=${item.address}`} className=" text-xl capitalize underline hover:text-indigo-900">
                              {item.name}
                            </a></td>
                          <td className="px-4 py-2">{item.fee} MATIC</td>
                          <td className="px-4 py-2">{item.duration} days</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}

        </div>
      </div>
      <div className="card  w-full mx-auto  items-center   px-5 py-5 mb-20">
        <h1 className="card-title  text-4xl text-left">Create Tier</h1>
        <form onSubmit={createSubscription} className="text-secondary w-full my-2">
          <label htmlFor="name" className="block font-medium  text-gray-500">
            Subscription Name{" "}
          </label>
          <input
            type="text"
            name="subscriptionName"
            id="subscriptionName"
            className=" input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={e => setSubscriptionName(e.target.value)}
          />
          <label htmlFor="name" className="block font-medium text-gray-500" >
            Subscription Description{" "}
          </label>
          <input
            type="text"
            name="subscriptionDescription"
            id="subscriptionDescription"
            className=" input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={e => setSubscriptionDescription(e.target.value)}
          />
          <label htmlFor="name" className="block font-medium  text-gray-500">
            Subscription Duration in seconds{" "}
          </label>
          <input
            type="text"
            name="subscriptionDuration"
            id="subscriptionDuration"
            className=" input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={e => setSubscriptionDuration(String(e.target.value))}
          />
          <label htmlFor="name" className="block font-medium text-gray-500 ">
            Subscription Fee{" "}
          </label>{" "}
          <input
            type="text"
            name="subscriptionFee"
            id="subscriptionfee"
            className=" input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={e => setSubscriptionFee(e.target.value)}
          />
          <div className="text-center">
            <button
              type="submit"
              className="btn-wide text-center items-center justify-center text-gray-500  bg-primary hover:bg-accent hover:text-accent-content font-bold py-2 px-4 my-5 rounded-md hover:"
            >
              Create Subscription
            </button>
          </div>
        </form>
        {address == _owner ? (
          <div className="card min-w-fit mx-auto   items-center  shadow-2xl px-5 py-5 mb-20">
            ETH Balance : {_contractBalance?.formatted}
            <button
              type="submit"
              className="btn-wide text-center items-center justify-center  bg-primary hover:bg-accent hover:text-accent-content font-bold py-2 px-4 my-5 rounded-md"
              onClick={withdrawETH.writeAsync}
            >
              Withdraw ETH
            </button>
          </div>
        ) : null}
      </div>
    </div >
  );
};

export default Tiers;
