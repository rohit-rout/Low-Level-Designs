import { CustomModule } from "./abstractClass.js";
import {
  BasicUserFactory,
  EmailPasswordStrategy,
  OAuthStrategy,
  UserProfileBuilder,
} from "./concreteClass.js";

export class LinkedInModule extends CustomModule {
  userFactory = new BasicUserFactory();
  auth = new OAuthStrategy();
  emailAuth = new EmailPasswordStrategy();
  profileBuilder = new UserProfileBuilder();
  // connectionManager = new ConnectionManager();

  async run() {
    // await this.userFactory.login(
    //   { email: "rohit@gmail.com", password: "test123" },
    //   this.emailAuth
    // );
    // const user = await this.userFactory.register(
    //   { email: "rohit@gmail.com", password: "test123" },
    //   this.emailAuth
    // );
    // await this.userFactory.login(
    //   { email: "rohit@gmail.com", password: "test123" },
    //   this.emailAuth
    // );

    // const profile = this.profileBuilder
    //   .setSkills(["c++", "java", "javascript"])
    //   .setHeadline("SDE 2 At FreshPrints")
    //   .setSummary("Has 3+ years of working experience")
    //   .setName("Rohit Rout")
    //   .build();
    // user.updateProfile(profile);
    // user.describe();

    const john = await this.userFactory.register(
      { email: "john@example.com", password: "password123" },
      this.emailAuth
    );
    const jane = await this.userFactory.register(
      { email: "jane@example.com", password: "securepass" },
      this.emailAuth
    );

    const charlie = await this.userFactory.register(
      {
        email: "charlie@example.com",
        password: "charlie123",
      },
      this.emailAuth
    );

    const request = john.sendConnectionRequest(jane.id);
    console.log("Connection request sent:", request.id);

    jane.respondToConnectionRequest(request.id, true);

    console.log("John connections", john.getConnections());
    console.log("Jane connections", jane.getConnections());

    const charlieRequest = charlie.sendConnectionRequest(jane.id);
    console.log("Connection request sent:", charlieRequest.id);

    jane.respondToConnectionRequest(charlieRequest.id, true);

    console.log("John connections", john.getConnections());
    console.log("Jane connections", jane.getConnections());
    console.log("charlie connections", charlie.getConnections());

    //    this.connectionManager.addObserver(john);
    //    this.connectionManager.addObserver(jane);
  }
}
