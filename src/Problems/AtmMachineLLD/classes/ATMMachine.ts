import { BaseATMState, IdleState } from "./ATMstates.js";

interface ATMMachineInterface {}

export class ATM implements ATMMachineInterface {
  private static instance = new ATM(); 
  private notes = new Map();
  private state: BaseATMState = new IdleState();

  private constructor() {
    this.notes.set(100,0);
    this.notes.set(200,0);
    this.notes.set(500,0);
  }

  public static getInstance() {
    if (ATM.instance === null) {
      ATM.instance = new ATM();
    }
    return this.instance;
  }

  public getCurrentState() {
    return this.state;
  }

  public setCurrentState(state: BaseATMState) {
    this.state = state;
  }

  public setNotes(noteValue: number, noteCount: number) {
    if (!this.notes.has(noteValue)) {
      throw new Error("unsupported denomination");
    }
    this.notes.set(noteValue, noteCount);
  }

  public getNotes(denomination: number) {
    return this.notes.get(denomination);
  }

  public printATMStatus() {
    console.log(this.notes);
  }
}
