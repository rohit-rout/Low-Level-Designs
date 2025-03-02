import { CustomModule } from "./abstractClass.js";
import { BasicUserFactory, EmailPasswordStrategy, OAuthStrategy, UserProfileBuilder } from "./concreteClass.js";
 
export class LinkedInModule extends CustomModule {
    userFactory = new BasicUserFactory();
    auth = new OAuthStrategy();
    emailAuth = new EmailPasswordStrategy();
    profileBuilder = new UserProfileBuilder();

    async run() {
         await this.userFactory.login({email: 'rohit@gmail.com',password: 'test123'},this.emailAuth);
         const user = await this.userFactory.register({email: 'rohit@gmail.com',password: 'test123'},this.emailAuth);
         await this.userFactory.login({email: 'rohit@gmail.com',password: 'test123'},this.emailAuth);

        const profile = this.profileBuilder.setSkills(['c++','java','javascript']).setHeadline('SDE 2 At FreshPrints').setSummary('Has 3+ years of working experience').setName('Rohit Rout').build();
        user.updateProfile(profile);
        user.describe();
    }

}

