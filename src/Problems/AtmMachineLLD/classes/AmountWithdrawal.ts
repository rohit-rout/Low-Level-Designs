import { ATM } from "./ATMMachine.js";
export abstract class CashWithdrawProcessor {
  nextCashWithdrawProcess: CashWithdrawProcessor;
  constructor(cashWithdrawProcessor: CashWithdrawProcessor) {
    this.nextCashWithdrawProcess = cashWithdrawProcessor;
  }
  withdraw(atm: ATM, balance: number) {
    if (this.nextCashWithdrawProcess)
      this.nextCashWithdrawProcess.withdraw(atm, balance);
  }
}

export class FiveHundredCashWithdrawProcessor extends CashWithdrawProcessor {
  withdraw(atm: ATM, remainingAmount: number) {
    console.log(`handling ${remainingAmount} with 500 notes`);
    const required = Math.floor(remainingAmount / 500);
    const balance = remainingAmount % 500;

    if (atm.getNotes(500) >= required) {
      atm.setNotes(500, atm.getNotes(500) - required);
    }

    if (balance > 0) super.withdraw(atm, balance);
  }
}

export class TwoHundredCashWithdrawProcessor extends CashWithdrawProcessor {
  withdraw(atm: ATM, remainingAmount: number) {
    console.log(`handling ${remainingAmount} with 200 notes`);
    const required = Math.floor(remainingAmount / 200);
    const balance = remainingAmount % 200;

    if (atm.getNotes(200) >= required) {
      atm.setNotes(200, atm.getNotes(200) - required);
    }

    if (balance > 0) super.withdraw(atm, balance);
  }
}

export class OneHundredCashWithdrawProcessor extends CashWithdrawProcessor {
  withdraw(atm: ATM, remainingAmount: number) {
    console.log(`handling ${remainingAmount} with 100 notes`);
    const required = Math.floor(remainingAmount / 100);
    const balance = remainingAmount % 100;

    if (atm.getNotes(100) >= required) {
      atm.setNotes(100, atm.getNotes(100) - required);
    }

    if (balance > 0) super.withdraw(atm, balance);
  }
}
