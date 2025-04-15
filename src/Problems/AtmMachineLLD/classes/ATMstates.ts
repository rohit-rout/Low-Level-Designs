import {
  FiveHundredCashWithdrawProcessor,
  OneHundredCashWithdrawProcessor,
  TwoHundredCashWithdrawProcessor,
} from "./AmountWithdrawal.js";
import { ATM } from "./ATMMachine.js";
import { Card } from "./Card.js";
import { User } from "./User.js";

export interface ATMstateInterface {
  enterPin(atm: ATM, card: Card, pin: string): void;
  selectOption(option: "withdraw" | "deposit", atm: ATM): void;
  enterAmount(atm: ATM, amount: Number, user: User): void;
  withdraw(atm: ATM, amount: number, user: User): void;
  displayBalance(atm: ATM): void;
}

export abstract class BaseATMState implements ATMstateInterface {
  insertCard(atm: ATM, card: Card): boolean {
    throw new Error("can not go in insertCard state");
  }

  enterPin(atm: ATM, card: Card, pin: string): void {
    throw new Error("can not go in enterPin state");
  }

  selectOption(option: "withdraw" | "deposit", atm: ATM): void {
    throw new Error("can not go in selectOption state");
  }
  enterAmount(atm: ATM, amount: Number, user: User): void {
    throw new Error("can not go in enterAmount state");
  }
  withdraw(atm: ATM, amount: number, user: User): void {
    throw new Error("can not go in withdraw state");
  }
  displayBalance(atm: ATM): void {}
}

export class IdleState extends BaseATMState {
  insertCard(atm: ATM, card: Card): boolean {
    console.log("In insert card state");
    atm.setCurrentState(new EnterPinState());
    return true;
  }
}

export class EnterPinState extends BaseATMState {
  enterPin(atm: ATM, card: Card, pin: string): void {
    if (card.pin === pin) {
      console.log("successfully validated your pin"),
        atm.setCurrentState(new SelectOptionState());
    } else {
      console.log("wrong pin, taking back to idle state");
      atm.setCurrentState(new IdleState());
    }
  }
}

export class SelectOptionState extends BaseATMState {
  selectOption(option: "withdraw" | "deposit", atm: ATM): void {
    if (option == "withdraw") {
      console.log("you are choosing withdraw and you can now enter the amount");
      atm.setCurrentState(new EnterAmountState());
    }
  }
}

export class EnterAmountState extends BaseATMState {
  enterAmount(atm: ATM, amount: number, user: User): void {
    console.log(`you entered the amount`, amount);
    if (
      amount > user.getBankAccount().getBalance() ||
      amount > atm.getBalance()
    ) {
      console.log("insufficient balance");
      atm.setCurrentState(new IdleState());
    } else {
      atm.setCurrentState(new WithdrawState());
      atm.getCurrentState().withdraw(atm, amount, user);
    }
  }
}

export class WithdrawState extends BaseATMState {
  withdraw(atm: ATM, amount: number, user: User): void {
    const cashWithdrawProcessor = new FiveHundredCashWithdrawProcessor(
      new TwoHundredCashWithdrawProcessor(
        new OneHundredCashWithdrawProcessor(null)
      )
    );
    cashWithdrawProcessor.withdraw(atm, amount);
    user
      .getBankAccount()
      .updateBalance(user.getBankAccount().getBalance() - amount);
    console.log("withdrawal successful");
    atm.setCurrentState(new IdleState());
  }
}
