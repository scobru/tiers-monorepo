import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDeployedContractInfo, useTransactor } from "../hooks/scaffold-eth";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import type { NextPage } from "next";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

const ViewTier: NextPage = () => {
  const { data: signer } = useSigner();
  const writeTx = useTransactor();
  const account = useAccount();
  const router = useRouter();
  const { addr } = router?.query;
  const { address } = useAccount();

  const [tierCid, setTierCid] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFee, setNewFee] = useState(0);
  const [newDuration, setNewDuration] = useState(0);
  const [timeLeftSecond, setTimeLeftSecond] = useState("");
  const deployedContract = useDeployedContractInfo("Tier");

  const { data: _name } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "name",
  });

  const { data: _description } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "description",
    enabled: Boolean(address && addr),
  });

  const { data: _fee } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "fee",
    cacheOnBlock: true,
    enabled: Boolean(address && addr),
  });

  const { data: _duration } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "subscriptionDuration",
    enabled: Boolean(address && addr),
  });

  const { data: _lastPayment } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "lastPaymentTime",
    args: [String(address)],
    enabled: Boolean(address && addr),
  });

  let { data: _isSub } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "getSubscriptionStatus",
    args: [String(address)],
    enabled: Boolean(address && addr),
  });

  const { data: _owner } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "owner",
    enabled: Boolean(address && addr),
  });

  const { data: _tierCidView } = useContractRead({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "getTierCid",
    args: [String(address)],
    enabled: Boolean(address && addr),
    cacheOnBlock: true,
  });

  useContractEvent({
    address: String(addr),
    abi: deployedContract.data?.abi,
    eventName: "SubscriptionRenewed",
    listener(sender, amount, nextpayment) {
      console.log(sender, amount, nextpayment);
    },
  });

  const setCidPrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "setTierCid",
    args: [String(tierCid)],
    enabled: Boolean(_owner === address && addr && tierCid),
  });

  const subscribeWritePrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "subscribe",
    overrides: { value: String(_fee) },
    enabled: Boolean(_isSub === false && addr && _fee!),
  });

  const changeNamePrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "changeName",
    args: [newName],
    enabled: Boolean(_owner === address && addr && newName),
  });

  const changeDescriptionPrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "changeDescription",
    args: [newDescription],
    enabled: Boolean(_owner === address && addr && newDescription),
  });

  const changeFeePrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "changeFee",
    args: [parseEther(String(newFee))],
    enabled: Boolean(_owner === address && addr && newFee > 0),
  });

  const changeDurationPrepared = usePrepareContractWrite({
    address: String(addr),
    abi: deployedContract.data?.abi,
    functionName: "changeSubscriptionDuration",
    args: [BigNumber.from(newDuration)],
    enabled: Boolean(_owner === address && addr && newDuration > 0),
  });

  const changeName = useContractWrite(changeNamePrepared.config);
  const changeDescription = useContractWrite(changeDescriptionPrepared.config);
  const changeFee = useContractWrite(changeFeePrepared.config);
  const changeDuration = useContractWrite(changeDurationPrepared.config);
  const subscribeWrite = useContractWrite(subscribeWritePrepared.config);
  const setCid = useContractWrite(setCidPrepared.config);

  async function timeLeft() {
    const timeLeft = Number(_lastPayment) + Number(_duration);
    const timeNow = Math.floor(Date.now() / 1000);
    const _timeLeftSeconds = timeLeft - timeNow;
    setTimeLeftSecond(formatSeconds(Number(_timeLeftSeconds)));
    console.log(timeLeftSecond);
    return timeLeftSecond;
  }

  async function getTime() {
    await timeLeft();
  }

  function formatSeconds(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);
    return `${days} days, ${hours} hours, ${minutes} minutes, ${secondsLeft} seconds`;
  }

  function formatDate(date: number) {
    // convert timestamp to days
    const days = Math.floor((date % 2629743) / 86400);
    return `${days} days`;
  }

  function formatBlockTimestamp(blockTimestamp: number) {
    const date = new Date(blockTimestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (_isSub === true) {
      getTime();
    }
  }, [_isSub, address, signer]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="w-full max-w-md p-10 bg-slate-200 my-6 text-black rounded-2xl  shadow-2xl shadow-black border-2 border-primary">
        <h1 className="text-3xl mb-2 font-semibold">{_name}</h1>
        <span className="text-lg mb-2 font-normal">{_description}</span>
        <p className="mb-5">
          <span className="font-semibold text-2xl">{_isSub === true ? `Subscribed` : "Not subscribed"}</span>
        </p>
        <form
          onSubmit={async e => {
            e.preventDefault();
            await writeTx(subscribeWrite?.writeAsync?.());
          }}
        >
          <label className="mb-2 block">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className=" mb-2 font-base">
                  <strong>🏦 Fee </strong>
                  <div className="font-medium px-10">{String(Number(_fee) / 1e18)} MATIC</div>
                </span>
                <span className=" mb-2 font-base">
                  <strong>📆 Duration </strong>
                  <div className="font-medium px-10">{formatDate(Number(_duration))}</div>{" "}
                </span>
              </div>
              <span className=" mb-2 font-base">
                <strong>🔒 Cid </strong>
              </span>
              <span className="font-medium px-10">{_tierCidView}</span>
            </div>
          </label>
          <label className="mb-5 block">
            <span className="text-lg mb-2 font-base">
              <strong>⌚ Time left </strong>{" "}
            </span>{" "}
            {timeLeftSecond ? (
              <span className="font-base"> {<div className="font-medium px-10">{timeLeftSecond}</div>}</span>
            ) : null}
          </label>

          <label className="mb-5 block">
            <span className="text-lg mb-2 font-base">
              <strong>🪙 Last payment </strong>{" "}
            </span>{" "}
            <span className="font-base">
              {_lastPayment ? (
                <span className="font-base">
                  {" "}
                  {<div className="font-medium px-10">{formatBlockTimestamp(Number(_lastPayment))}</div>}
                </span>
              ) : null}{" "}
            </span>
          </label>
          <button type="submit" className="btn btn-primary" disabled={!account || !signer || _isSub}>
            Subscribe
          </button>
        </form>
      </div>
      {_owner == address ? (
        <div className="w-full max-w-md p-10 bg-slate-200 mt-6 text-black rounded-2xl shadow-2xl shadow-black border-2 border-primary">
          <p className="font-proxima text-base font-normal justify-start"> Share your IPFS CID to your subscribers</p>
          <input
            className="input mb-5"
            type="text"
            placeholder="CID"
            onChange={e => setTierCid(String(e.target.value))}
          />
          <button className="btn btn-primary mx-2" onClick={setCid.writeAsync}>
            Set CID
          </button>

          <p className="font-normal justify-start"> Change Tier Name</p>
          <input
            className="input mb-5"
            type="text"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button className="btn btn-primary mx-2" onClick={changeName.writeAsync}>
            Change
          </button>

          <p className="font-normal justify-start"> Change Tier Description</p>
          <input
            className="input mb-5"
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
          <button className="btn btn-primary mx-2" onClick={changeDescription.writeAsync}>
            Change
          </button>

          <p className="font-normal justify-start"> Change Tier Duration</p>
          <input
            className="input mb-5"
            type="text"
            placeholder="Duration"
            value={newDuration}
            onChange={e => setNewDuration(Number(e.target.value))}
          />
          <button className="btn btn-primary mx-2" onClick={changeDuration.writeAsync}>
            Change
          </button>

          <p className="font-normal justify-start"> Change Tier Fee</p>
          <input
            className="input mb-5"
            type="text"
            placeholder="Fee"
            onChange={e => setNewFee(Number(e.target.value))}
          />
          <button className="btn btn-primary mx-2" onClick={changeFee.writeAsync}>
            Change
          </button>
        </div>
      ) : null}
      <div className="divider"></div>
      <div className=" flex flex-col text-3xl  my-5 font-bold justify-center text-justify p-4">
        Import your subscription in your dapp.
      </div>
      <div className="mockup-code">
        <pre data-prefix="">
          <code>
            <code className="text-warning">ITier</code>
            (YOUR_TIER_CONTRACT).<code className="text-warning">isValidSubscription</code>(SUBSCRIBER_ADDRESS)
          </code>
        </pre>
        <pre data-prefix="">
          <code>
            <code className="text-warning">ITier</code>
            (YOUR_TIER_CONTRACT).<code className="text-warning">subscribe</code>()
          </code>
        </pre>
        <pre data-prefix="">
          <code>
            <code className="text-warning">ITier</code>
            (YOUR_TIER_CONTRACT).<code className="text-warning">fee</code>()
          </code>
        </pre>
      </div>
    </div>
  );
};
export default ViewTier;
