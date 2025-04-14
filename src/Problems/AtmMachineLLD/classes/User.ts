import { BankAccount } from "./BankAccount.js";
import { Card } from "./Card.js";

export class User {
  card: Card;
  bankAccount: BankAccount;

  constructor() {}

  getCard(): Card {
    return this.card;
  }

  setCard(card: Card): void {
    this.card = card;
  }

  getBankAccount(): BankAccount {
    return this.bankAccount;
  }

  setBankAccount(bankAccount: BankAccount): void {
    this.bankAccount = bankAccount;
  }
}
