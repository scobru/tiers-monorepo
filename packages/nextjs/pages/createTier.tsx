import React from "react";
import { useDeployedContractInfo, useScaffoldContract, useScaffoldContractWrite, useScaffoldEventSubscriber } from "../hooks/scaffold-eth";
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


  const { data: _owner } = useContractRead({
    address: deployedContractFactory.data?.address,
    abi: deployedContractFactory?.data?.abi,
    functionName: "owner",
  });

  const { data: _contractBalance } = useBalance({
    address: deployedContractFactory.data?.address,
  });

  const getContractData = async function getContractData() {
    if (!address) {
      return;
    }

    try {
      const tierInstance = new ethers.Contract(
        deployedContractFactory?.data?.address,
        deployedContractFactory?.data?.abi,
        signer
      );
      const _subscriptions = await tierInstance.getContractsOwnedBy(String(address));
      const _totalSubscription = await tierInstance.getContracts();

      const filteredSubscriptions = _subscriptions.filter(feed => feed !== "0x0000000000000000000000000000000000000000");
      const filteredTotalSubscriptions = _totalSubscription.filter(feed => feed !== "0x0000000000000000000000000000000000000000");

      console.log("filteredSubscriptions", filteredSubscriptions);
      console.log("filteredTotalSubscriptions", filteredTotalSubscriptions);
      const promises1 = filteredTotalSubscriptions.map(async (item) => {
        const ctx = new ethers.Contract(item, deployedContract?.data?.abi, signer);
        const [_name, _description, _fee, _duration] = await Promise.all([
          ctx.name(),
          ctx.description(),
          ctx.fee(),
          ctx.subscriptionDuration(),
        ]);

        return {
          name: _name,
          description: _description,
          fee: Number(_fee) / 1e18,
          duration: Math.floor(Number(_duration) / 86400),
          address: item,
        };
      });

      const promises2 = filteredSubscriptions.map(async (item) => {
        const ctx = new ethers.Contract(item, deployedContract?.data?.abi, signer || provider);
        const [_name, _description, _fee, _duration] = await Promise.all([
          ctx.name(),
          ctx.description(),
          ctx.fee(),
          ctx.subscriptionDuration(),
        ]);

        return {
          name: _name,
          description: _description,
          fee: Number(_fee) / 1e18,
          duration: Math.floor(Number(_duration) / 86400),
          address: item,
        };
      });

      const [_tier, _ownedTier] = await Promise.all([Promise.all(promises1), Promise.all(promises2)]);

      setAllTiers(_tier);
      console.log(allTiers);
      setSubscriptions(filteredSubscriptions);
      setOwnedTiers(_ownedTier);
    } catch (error) {
      console.log(error);
      // Handle the error appropriately, such as displaying an error message to the user
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
          onClick={async () => {
            await getContractData();
            setShowAllTiers(!showAllTiers);
          }}
        >
          {showAllTiers ? "Owned Tiers" : "All Tiers"}
        </button>
        <div className="flex flex-col items-center text-center text-base justify-center w-full mx-auto max-w-md p-4 md:p-10 px-4 md:px-20 mb-5 mt-5">
          {subscriptions && !showAllTiers && (
            <div className="card text-xl text-base-content py-2 px-2 font-semibold">
              <div className="text-3xl font-extrabold mb-10">Owned</div>
              <table className="table-auto w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Fee</th>
                    <th className="px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {ownedTiers.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <a href={`/viewTier?addr=${item.address}`} className="text-xl capitalize underline hover:text-indigo-900">
                          {item.name}
                        </a>
                      </td>
                      <td className="px-4 py-2">{item.fee} MATIC</td>
                      <td className="px-4 py-2">{item.duration} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {subscriptions && showAllTiers && (
            <div className="card text-xl text-base-content py-2 px-2 font-semibold">
              <div className="text-3xl font-extrabold mb-10">All Tiers</div>
              <table className="table-auto w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Fee</th>
                    <th className="px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {allTiers.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <a href={`/viewTier?addr=${item.address}`} className="text-xl capitalize underline hover:text-indigo-900">
                          {item.name}
                        </a>
                      </td>
                      <td className="px-4 py-2">{item.fee} MATIC</td>
                      <td className="px-4 py-2">{item.duration} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}


        </div>
      </div>
      <div className="card  w-full mx-auto mt-10 items-center px-10 py-10 mb-20">
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
              className="btn btn-wide text-center items-center justify-center text-gray-500  bg-primary hover:bg-secondary hover:text-secondary-content font-bold py-2 px-4 my-5 rounded-md hover:"
            >
              Create Subscription
            </button>
          </div>
        </form>
        {address == _owner ? (

          <div className="card min-w-fit mx-auto items-center mb-20">
            <h1 className="card-title  text-4xl text-left m-2">ETH Balance : {_contractBalance?.formatted}</h1>

            <button
              type="submit"
              className="btn btn-wide m-2 text-center items-center justify-center  bg-primary hover:bg-secondary hover:text-secondary-content font-bold  rounded-md"
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
