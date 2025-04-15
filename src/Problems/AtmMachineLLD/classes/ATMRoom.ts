import { ATM } from "./ATMMachine.js";
import { BankAccount } from "./BankAccount.js";
import { Card } from "./Card.js";
import { User } from "./User.js";

export class ATMRoom {
  private user: User;
  private atm = ATM.getInstance();

  initialize() {
    this.atm.setNotes(100, 2);
    this.atm.setNotes(200, 2);
    this.atm.setNotes(500, 2);
    this.user = this.createUser();

    this.atm.getCurrentState().insertCard(this.atm, this.user.getCard());
    this.atm.getCurrentState().enterPin(this.atm, this.user.getCard(), "12345");
    this.atm.getCurrentState().insertCard(this.atm, this.user.getCard());
    this.atm.getCurrentState().enterPin(this.atm, this.user.getCard(), "1234");
    this.atm.getCurrentState().selectOption("withdraw", this.atm);
    this.atm.printATMBalanceStatus();
    this.atm.getCurrentState().enterAmount(this.atm, 2000, this.user);
    this.atm.printATMBalanceStatus();
  }

  createUser(): User {
    const user = new User();
    user.setCard(this.createCard());
    user.setBankAccount(this.createBankAccount());
    return user;
  }

  createCard(): Card {
    const card = new Card("AB123", "1234");
    return card;
  }

  createBankAccount(): BankAccount {
    const bankAccount = new BankAccount();
    return bankAccount;
  }
}
