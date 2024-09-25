"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketById = exports.getAllTickets = exports.updateTicket = exports.deleteTicket = exports.createTicket = void 0;
const deleteTicket_1 = __importDefault(require("./deleteTicket"));
exports.deleteTicket = deleteTicket_1.default;
const createTicket_1 = __importDefault(require("./createTicket"));
exports.createTicket = createTicket_1.default;
const updateTicket_1 = __importDefault(require("./updateTicket"));
exports.updateTicket = updateTicket_1.default;
const getTicket_1 = __importDefault(require("./getTicket"));
exports.getAllTickets = getTicket_1.default;
const getOneTicket_1 = __importDefault(require("./getOneTicket"));
exports.getTicketById = getOneTicket_1.default;
