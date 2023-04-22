import React from "react";
import type { NextPage } from "next";

const Index: NextPage = () => {
  return (
    <div className="flex min-w-fit flex-col mx-auto flex-grow pt-10 text-base-content">
      <div className="max-w-3xl text-center my-2">
        <h1 className="text-center mb-8">
          <span className="block text-6xl font-bold">⨇ T I E R S </span>
        </h1>
        <h1 className="text-4xl font-bold mb-20">
          Monetize your products, DApps, or content with our Tier Subscription
        </h1>
        <p className="text-xl  mb-2">
          Increase user loyalty by offering premium content and exclusive rewards to subscribers, unlocking a new
          revenue stream for your business. Try our Patreon-like service now and enjoy guaranteed, recurring income for
          your app
        </p>
      </div>
    </div>
  );
};

export default Index;
