export class BankAccount {
  balance: number;
  updateBalance(balance: number) {
    this.balance = balance;
  }

  getBalance() {
    return this.balance;
  }
}
