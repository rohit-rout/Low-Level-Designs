import { ATM } from "./ATMMachine.js";
import { Card } from "./Card.js";

export interface ATMstateInterface {
  enterPin(atm: ATM, card: Card, pin: Number): void;
  selectOption(): void;
  enterAmount(): void;
  withdraw(atm: ATM, card: Card, amount: Number): void;
  displayBalance(atm: ATM): void;
}

export abstract class BaseATMState implements ATMstateInterface {
  insertCard(atm: ATM, card: Card): boolean {
    throw new Error("can not go in insertCard state");
  }

  enterPin(atm: ATM, card: Card, pin: Number): void {
    throw new Error("can not go in enterPin state");
  }

  selectOption(): void {
    throw new Error("can not go in selectOption state");
  }
  enterAmount(): void {
    throw new Error("can not go in enterAmount state");
  }
  withdraw(atm: ATM, card: Card, amount: Number): void {
    throw new Error("can not go in withdraw state");
  }
  displayBalance(atm: ATM): void {}
}

export class IdleState extends BaseATMState {
  insertCard(atm:ATM, card:Card): boolean {
    console.log('In insert card state');
    atm.setCurrentState(new EnterPinState());
    return true;
  }
}

export class EnterPinState extends BaseATMState {
  enterPin(): void {}
}

export class SelectOptionState extends BaseATMState {
  selectOption(): void {}
}

export class EnterAmountState extends BaseATMState {
  enterAmount(): void {}
}

export class WithdrawState extends BaseATMState {
  withdraw(): void {}
}
