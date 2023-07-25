import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import tierBanner from "../public/assets/banner.png"

const Index: NextPage = () => {
  return (
    <div className="flex min-w-fit flex-col mx-auto flex-grow pt-10 text-base-content">
      <div className="max-w-3xl text-center items-center my-2 mx-8">
        {/* <h1 className="text-center mb-8">
          <span className="block text-6xl font-bold">⨇ T I E R S </span>
        </h1> */}
        <Image src={tierBanner} alt="Tiers Banner" className="mx-auto mb-10 justify-start" />
        <h1 className="text-4xl font-semibold mb-10">
          Monetize your products, dapps, or content with our tier subscription service.
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
