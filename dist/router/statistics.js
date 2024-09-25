"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistics_1 = require("../controller/statistics");
const router = express_1.default.Router();
router.get("/get-statistics", statistics_1.getStatistics);
exports.default = router;
