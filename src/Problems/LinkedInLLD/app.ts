import { CustomModule } from "./abstractClass.js";
import { BasicUserFactory, OAuthStrategy, User } from "./concreteClass.js";
 
export class LinkedInModule extends CustomModule {
    userFactory = new BasicUserFactory();
    auth = new OAuthStrategy();

     run() {
         this.userFactory.login('google',this.auth);
    }

}

