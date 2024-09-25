export class TransactionInfo {
    id: number = 0
    domain: string = ""
    status: string = ""
    reference: string = ""
    receipt_number: any
    amount: number = 0
    message: any
    gateway_response: string = ""
    paid_at: string = ""
    created_at: string = ""
    channel: string = ""
    currency: string = ""
    ip_address: string = ""
    metadata: string = ""
    log: Log = new Log()
    fees: number = 0
    fees_split: any
    authorization: Authorization = new Authorization()
    customer: Customer = new Customer()
    plan: any
    split: Split = new Split()
    order_id: any
    paidAt: string = ""
    createdAt: string = ""
    requested_amount: number = 0
    pos_transaction_data: any
    source: any
    fees_breakdown: any
    connect: any
    transaction_date: string = ""
    plan_object: PlanObject = new PlanObject()
    subaccount: Subaccount = new Subaccount()
  }
  
  export class Log {
    start_time: number = 0
    time_spent: number = 0
    attempts: number = 0
    errors: number = 0
    success: boolean = false
    mobile: boolean = false
    input: any[] = []
    history: History[] = new Array<History>()
  }
  
  export class History {
    type: string = ""
    message: string = ""
    time: number = 0
  }
  
  export class Authorization {
    authorization_code: string = ""
    bin: string = ""
    last4: string = ""
    exp_month: string = ""
    exp_year: string = ""
    channel: string = ""
    card_type: string = ""
    bank: string = ""
    country_code: string = ""
    brand: string = ""
    reusable: boolean = false
    signature: string = ""
    account_name: any
  }
  
  export class Customer {
    id: number = 0
    first_name: string = ""
    last_name: string = ""
    email: string = ""
    customer_code: string = ""
    phone: string = ""
    metadata: any
    risk_action: string = ""
    international_format_phone: any
  }
  
  export class Split {}
  
  export class PlanObject {}
  
  export class Subaccount {}
  