"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var scaffold_eth_1 = require("../hooks/scaffold-eth");
var ethers_1 = require("ethers");
var utils_js_1 = require("ethers/lib/utils.js");
var wagmi_1 = require("wagmi");
var scaffold_eth_2 = require("~~/utils/scaffold-eth");
var Tiers = function () {
    var _a, _b, _c, _d, _e;
    var signer = wagmi_1.useSigner().data;
    var address = wagmi_1.useAccount().address;
    var _f = react_1["default"].useState([]), subscriptions = _f[0], setSubscriptions = _f[1];
    var _g = react_1["default"].useState(""), subscriptionName = _g[0], setSubscriptionName = _g[1];
    var _h = react_1["default"].useState("0"), subscriptionDescription = _h[0], setSubscriptionDescription = _h[1];
    var _j = react_1["default"].useState("0"), subscriptionFee = _j[0], setSubscriptionFee = _j[1];
    var _k = react_1["default"].useState(""), subscriptionDuration = _k[0], setSubscriptionDuration = _k[1];
    var _l = react_1["default"].useState(0), totalSubscriptions = _l[0], setTotalSubscriptions = _l[1];
    var deployedContractFactory = scaffold_eth_1.useDeployedContractInfo("TierFactory");
    var deployedContract = scaffold_eth_1.useDeployedContractInfo("Tier");
    var _m = react_1["default"].useState([]), allTiers = _m[0], setAllTiers = _m[1];
    var _o = react_1["default"].useState([]), ownedTiers = _o[0], setOwnedTiers = _o[1];
    var _p = react_1["default"].useState(false), showAllTiers = _p[0], setShowAllTiers = _p[1];
    var _fee = wagmi_1.useContractRead({
        address: (_a = deployedContractFactory.data) === null || _a === void 0 ? void 0 : _a.address,
        abi: (_b = deployedContractFactory === null || deployedContractFactory === void 0 ? void 0 : deployedContractFactory.data) === null || _b === void 0 ? void 0 : _b.abi,
        functionName: "getCreationFee"
    }).data;
    var _owner = wagmi_1.useContractRead({
        address: (_c = deployedContractFactory.data) === null || _c === void 0 ? void 0 : _c.address,
        abi: (_d = deployedContractFactory === null || deployedContractFactory === void 0 ? void 0 : deployedContractFactory.data) === null || _d === void 0 ? void 0 : _d.abi,
        functionName: "owner"
    }).data;
    var _contractBalance = wagmi_1.useBalance({
        address: (_e = deployedContractFactory.data) === null || _e === void 0 ? void 0 : _e.address
    }).data;
    var getContractData = function getContractData() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tierInstance, _subscriptions, _totalSubscription, filteredSubscriptions, filteredTotalSubscriptions, promises1, promises2, _c, _tier, _ownedTier, error_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!address) {
                            return [2 /*return*/];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        tierInstance = new ethers_1.ethers.Contract((_a = deployedContractFactory === null || deployedContractFactory === void 0 ? void 0 : deployedContractFactory.data) === null || _a === void 0 ? void 0 : _a.address, (_b = deployedContractFactory === null || deployedContractFactory === void 0 ? void 0 : deployedContractFactory.data) === null || _b === void 0 ? void 0 : _b.abi, signer);
                        return [4 /*yield*/, tierInstance.getContractsOwnedBy(String(address))];
                    case 2:
                        _subscriptions = _d.sent();
                        return [4 /*yield*/, tierInstance.getContracts()];
                    case 3:
                        _totalSubscription = _d.sent();
                        filteredSubscriptions = _subscriptions.filter(function (feed) { return feed !== "0x0000000000000000000000000000000000000000"; });
                        filteredTotalSubscriptions = _totalSubscription.filter(function (feed) { return feed !== "0x0000000000000000000000000000000000000000"; });
                        console.log("filteredSubscriptions", filteredSubscriptions);
                        console.log("filteredTotalSubscriptions", filteredTotalSubscriptions);
                        promises1 = filteredTotalSubscriptions.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var ctx, _a, _name, _description, _fee, _duration;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        ctx = new ethers_1.ethers.Contract(item, (_b = deployedContract === null || deployedContract === void 0 ? void 0 : deployedContract.data) === null || _b === void 0 ? void 0 : _b.abi, signer);
                                        return [4 /*yield*/, Promise.all([
                                                ctx.name(),
                                                ctx.description(),
                                                ctx.fee(),
                                                ctx.subscriptionDuration(),
                                            ])];
                                    case 1:
                                        _a = _c.sent(), _name = _a[0], _description = _a[1], _fee = _a[2], _duration = _a[3];
                                        return [2 /*return*/, {
                                                name: _name,
                                                description: _description,
                                                fee: Number(_fee) / 1e18,
                                                duration: Math.floor(Number(_duration) / 86400),
                                                address: item
                                            }];
                                }
                            });
                        }); });
                        promises2 = filteredSubscriptions.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var ctx, _a, _name, _description, _fee, _duration;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        ctx = new ethers_1.ethers.Contract(item, (_b = deployedContract === null || deployedContract === void 0 ? void 0 : deployedContract.data) === null || _b === void 0 ? void 0 : _b.abi, signer || provider);
                                        return [4 /*yield*/, Promise.all([
                                                ctx.name(),
                                                ctx.description(),
                                                ctx.fee(),
                                                ctx.subscriptionDuration(),
                                            ])];
                                    case 1:
                                        _a = _c.sent(), _name = _a[0], _description = _a[1], _fee = _a[2], _duration = _a[3];
                                        return [2 /*return*/, {
                                                name: _name,
                                                description: _description,
                                                fee: Number(_fee) / 1e18,
                                                duration: Math.floor(Number(_duration) / 86400),
                                                address: item
                                            }];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all([Promise.all(promises1), Promise.all(promises2)])];
                    case 4:
                        _c = _d.sent(), _tier = _c[0], _ownedTier = _c[1];
                        setAllTiers(_tier);
                        console.log(allTiers);
                        setSubscriptions(filteredSubscriptions);
                        setOwnedTiers(_ownedTier);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        console.log(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    var createSubscriptionWrite = scaffold_eth_1.useScaffoldContractWrite({
        contractName: "TierFactory",
        functionName: "createContract",
        args: [
            signer === null || signer === void 0 ? void 0 : signer.getAddress(),
            subscriptionName,
            subscriptionDescription,
            utils_js_1.parseEther(subscriptionFee),
            ethers_1.BigNumber.from(Number(subscriptionDuration)),
        ],
        value: String(Number(_fee) / 1e18 > 0 ? String(Number(_fee) / 1e18) : String(0))
    });
    var createSubscription = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            e.preventDefault();
            (_a = createSubscriptionWrite.writeAsync) === null || _a === void 0 ? void 0 : _a.call(createSubscriptionWrite);
            return [2 /*return*/];
        });
    }); };
    var withdrawETH = scaffold_eth_1.useScaffoldContractWrite({
        contractName: "TierFactory",
        functionName: "withdrawETH"
    });
    scaffold_eth_1.useScaffoldEventSubscriber({
        contractName: "TierFactory",
        eventName: "ContractCreated",
        listener: function (creator, contract) {
            scaffold_eth_2.notification.success("Subscription Created");
            console.log(creator, contract);
        }
    });
    react_1["default"].useEffect(function () {
        getContractData();
    }, [signer, address]);
    return (react_1["default"].createElement("div", { className: "flex flex-col w-full px-4 md:w-2/3 md:px-0 mx-auto flex-grow pt-10 " },
        react_1["default"].createElement("div", { className: "w-full" },
            react_1["default"].createElement("button", { className: "btn btn-primary", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getContractData()];
                            case 1:
                                _a.sent();
                                setShowAllTiers(!showAllTiers);
                                return [2 /*return*/];
                        }
                    });
                }); } }, showAllTiers ? "Owned Tiers" : "All Tiers"),
            react_1["default"].createElement("div", { className: "flex flex-col items-center text-center text-base justify-center w-full mx-auto max-w-md p-4 md:p-10 px-4 md:px-20 mb-5 mt-5" },
                subscriptions && !showAllTiers && (react_1["default"].createElement("div", { className: "card text-xl text-base-content py-2 px-2 font-semibold" },
                    react_1["default"].createElement("div", { className: "text-6xl font-extrabold mb-10" }, "Owned"),
                    react_1["default"].createElement("table", { className: "table-auto w-full text-left whitespace-nowrap" },
                        react_1["default"].createElement("thead", null,
                            react_1["default"].createElement("tr", null,
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Name"),
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Fee"),
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Duration"))),
                        react_1["default"].createElement("tbody", null, ownedTiers.map(function (item, index) { return (react_1["default"].createElement("tr", { key: index },
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                react_1["default"].createElement("a", { href: "/viewTier?addr=" + item.address, className: "text-xl capitalize underline hover:text-indigo-900" }, item.name)),
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                item.fee,
                                " MATIC"),
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                item.duration,
                                " days"))); }))))),
                subscriptions && showAllTiers && (react_1["default"].createElement("div", { className: "card text-xl text-base-content py-2 px-2 font-semibold" },
                    react_1["default"].createElement("div", { className: "text-6xl font-extrabold mb-10" }, "All Tiers"),
                    react_1["default"].createElement("table", { className: "table-auto w-full text-left whitespace-nowrap" },
                        react_1["default"].createElement("thead", null,
                            react_1["default"].createElement("tr", null,
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Name"),
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Fee"),
                                react_1["default"].createElement("th", { className: "px-4 py-2" }, "Duration"))),
                        react_1["default"].createElement("tbody", null, allTiers.map(function (item, index) { return (react_1["default"].createElement("tr", { key: index },
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                react_1["default"].createElement("a", { href: "/viewTier?addr=" + item.address, className: "text-xl capitalize underline hover:text-indigo-900" }, item.name)),
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                item.fee,
                                " MATIC"),
                            react_1["default"].createElement("td", { className: "px-4 py-2" },
                                item.duration,
                                " days"))); }))))))),
        react_1["default"].createElement("div", { className: "card  w-full mx-auto mt-10 items-center px-10 py-10 mb-20" },
            react_1["default"].createElement("h1", { className: "card-title  text-4xl text-left" }, "Create Tier"),
            react_1["default"].createElement("form", { onSubmit: createSubscription, className: "w-full my-2" },
                react_1["default"].createElement("label", { htmlFor: "name", className: "block font-medium  text-gray-500" },
                    "Subscription Name",
                    " "),
                react_1["default"].createElement("input", { type: "text", name: "subscriptionName", id: "subscriptionName", className: " input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", onChange: function (e) { return setSubscriptionName(e.target.value); } }),
                react_1["default"].createElement("label", { htmlFor: "name", className: "block font-medium text-gray-500" },
                    "Subscription Description",
                    " "),
                react_1["default"].createElement("input", { type: "text", name: "subscriptionDescription", id: "subscriptionDescription", className: " input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", onChange: function (e) { return setSubscriptionDescription(e.target.value); } }),
                react_1["default"].createElement("label", { htmlFor: "name", className: "block font-medium  text-gray-500" },
                    "Subscription Duration in seconds",
                    " "),
                react_1["default"].createElement("input", { type: "text", name: "subscriptionDuration", id: "subscriptionDuration", className: " input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", onChange: function (e) { return setSubscriptionDuration(String(e.target.value)); } }),
                react_1["default"].createElement("label", { htmlFor: "name", className: "block font-medium text-gray-500 " },
                    "Subscription Fee",
                    " "),
                " ",
                react_1["default"].createElement("input", { type: "text", name: "subscriptionFee", id: "subscriptionfee", className: " input-lg text-xl block w-full px-3 py-3 my-5  border-2 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", onChange: function (e) { return setSubscriptionFee(e.target.value); } }),
                react_1["default"].createElement("div", { className: "text-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "btn btn-wide text-center items-center justify-center text-gray-500  bg-primary hover:bg-secondary hover:text-secondary-content font-bold py-2 px-4 my-5 rounded-md hover:" }, "Create Subscription"))),
            address == _owner ? (react_1["default"].createElement("div", { className: "card min-w-fit mx-auto items-center mb-20" },
                react_1["default"].createElement("h1", { className: "card-title  text-4xl text-left m-2" },
                    "ETH Balance : ", _contractBalance === null || _contractBalance === void 0 ? void 0 :
                    _contractBalance.formatted),
                react_1["default"].createElement("button", { type: "submit", className: "btn btn-wide m-2 text-center items-center justify-center  bg-primary hover:bg-secondary hover:text-secondary-content font-bold  rounded-md", onClick: withdrawETH.writeAsync }, "Withdraw ETH"))) : null)));
};
exports["default"] = Tiers;
