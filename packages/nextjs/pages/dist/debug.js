"use strict";
exports.__esModule = true;
var react_1 = require("react");
var scaffold_eth_1 = require("~~/components/scaffold-eth");
var contractNames_1 = require("~~/utils/scaffold-eth/contractNames");
var Debug = function () {
    var contractNames = contractNames_1.getContractNames();
    var _a = react_1.useState(contractNames[0]), selectedContract = _a[0], setSelectedContract = _a[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center" }, contractNames.length === 0 ? (React.createElement("p", { className: "text-3xl mt-14" }, "No contracts found!")) : (React.createElement(React.Fragment, null,
            contractNames.length > 1 && (React.createElement("div", { className: "flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap" }, contractNames.map(function (contractName) { return (React.createElement("button", { className: "btn btn-secondary btn-sm normal-case font-thin " + (contractName === selectedContract ? "bg-base-300" : "bg-base-100"), key: contractName, onClick: function () { return setSelectedContract(contractName); } }, contractName)); }))),
            contractNames.map(function (contractName) { return (React.createElement(scaffold_eth_1.ContractUI, { key: contractName, contractName: contractName, className: contractName === selectedContract ? "" : "hidden" })); })))),
        React.createElement("div", { className: "text-center mt-8 bg-secondary p-10" },
            React.createElement("h1", { className: "text-4xl my-0" }, "Debug Contracts"),
            React.createElement("p", { className: "text-neutral" },
                "You can debug & interact with your deployed contracts here.",
                React.createElement("br", null),
                " Check",
                " ",
                React.createElement("code", { className: "italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1" }, "packages / nextjs / pages / debug.tsx"),
                " "))));
};
exports["default"] = Debug;
