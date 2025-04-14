import { ATM } from "./ATMMachine.js";
import { BankAccount } from "./BankAccount.js";
import { Card } from "./Card.js";
import { User } from "./User.js";

export class ATMRoom {
  private user: User;
  private atm = ATM.getInstance();


  initialize() {
     this.atm.setNotes(100, 100);
     this.atm.setNotes(200, 100);
     this.atm.setNotes(500, 100);
     this.user = this.createUser();

     this.atm.getCurrentState().insertCard(this.atm, this.user.getCard());
     
  }

  createUser(): User {
    const user = new User();
    user.setCard(this.createCard());
    user.setBankAccount(this.createBankAccount());
    return user;
  }

  createCard() : Card {
    const card = new Card("AB123", "1234");
    return card
  }

  createBankAccount() : BankAccount {
    const bankAccount = new BankAccount();
    return bankAccount;
  }
}
