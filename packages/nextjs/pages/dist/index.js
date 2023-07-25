"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var banner_png_1 = require("../public/assets/banner.png");
var Index = function () {
    return (react_1["default"].createElement("div", { className: "flex min-w-fit flex-col mx-auto flex-grow pt-10 text-base-content" },
        react_1["default"].createElement("div", { className: "max-w-3xl text-center items-center my-2 mx-8" },
            react_1["default"].createElement(image_1["default"], { src: banner_png_1["default"], alt: "Tiers Banner", className: "mx-auto mb-10 justify-start" }),
            react_1["default"].createElement("h1", { className: "text-4xl font-semibold mb-10" }, "Monetize your products, dapps, or content with our tier subscription service."),
            react_1["default"].createElement("p", { className: "text-xl  mb-2" }, "Increase user loyalty by offering premium content and exclusive rewards to subscribers, unlocking a new revenue stream for your business. Try our Patreon-like service now and enjoy guaranteed, recurring income for your app"))));
};
exports["default"] = Index;
