import { CustomModule } from "../common.js";
import { ATMRoom } from "./classes/ATMRoom.js";

export class ATMMachineModule extends CustomModule {
  run() {
    const atmRoom = new ATMRoom();
    atmRoom.initialize();
  }
}
