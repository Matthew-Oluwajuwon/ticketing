"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subaccount = exports.PlanObject = exports.Split = exports.Customer = exports.Authorization = exports.History = exports.Log = exports.TransactionInfo = void 0;
class TransactionInfo {
    constructor() {
        this.id = 0;
        this.domain = "";
        this.status = "";
        this.reference = "";
        this.amount = 0;
        this.gateway_response = "";
        this.paid_at = "";
        this.created_at = "";
        this.channel = "";
        this.currency = "";
        this.ip_address = "";
        this.metadata = "";
        this.log = new Log();
        this.fees = 0;
        this.authorization = new Authorization();
        this.customer = new Customer();
        this.split = new Split();
        this.paidAt = "";
        this.createdAt = "";
        this.requested_amount = 0;
        this.transaction_date = "";
        this.plan_object = new PlanObject();
        this.subaccount = new Subaccount();
    }
}
exports.TransactionInfo = TransactionInfo;
class Log {
    constructor() {
        this.start_time = 0;
        this.time_spent = 0;
        this.attempts = 0;
        this.errors = 0;
        this.success = false;
        this.mobile = false;
        this.input = [];
        this.history = new Array();
    }
}
exports.Log = Log;
class History {
    constructor() {
        this.type = "";
        this.message = "";
        this.time = 0;
    }
}
exports.History = History;
class Authorization {
    constructor() {
        this.authorization_code = "";
        this.bin = "";
        this.last4 = "";
        this.exp_month = "";
        this.exp_year = "";
        this.channel = "";
        this.card_type = "";
        this.bank = "";
        this.country_code = "";
        this.brand = "";
        this.reusable = false;
        this.signature = "";
    }
}
exports.Authorization = Authorization;
class Customer {
    constructor() {
        this.id = 0;
        this.first_name = "";
        this.last_name = "";
        this.email = "";
        this.customer_code = "";
        this.phone = "";
        this.risk_action = "";
    }
}
exports.Customer = Customer;
class Split {
}
exports.Split = Split;
class PlanObject {
}
exports.PlanObject = PlanObject;
class Subaccount {
}
exports.Subaccount = Subaccount;
