import { CustomModule } from "./abstractClass.js";
import { User } from "./concreteClass.js";
 
export class LinkedInModule extends CustomModule {
    user = new User('user_1','basic');

     run() {
        this.user.getProfile();
        console.log('hello');
    }

}

