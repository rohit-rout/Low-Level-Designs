import { UserFactory } from "./abstractClass.js";
import {
  AuthStrategy,
  ConnectionObserver,
  EStatus,
  IConnectionRequest,
  Profile,
} from "./interface.js";

export class User implements ConnectionObserver {
  constructor(
    public id: string,
    public type: "basic" | "premium",
    public email: string,
    public profile: Profile,
    private connections = new Set<string>(),
    private connectionMediator = ConnectionMediator.getInstance(),
    private pendingRequests = new Map<string, IConnectionRequest>()
  ) {}

  describe() {
    return this.profile.describe();
  }

  updateProfile(updateProfile: Profile) {
    this.profile = updateProfile;
  }

  sendConnectionRequest(targetUserId: string) {
    return this.connectionMediator.createRequest(this.id, targetUserId);
  }

  respondToConnectionRequest(requestId: string, accept: boolean) {
    const request = this.pendingRequests.get(requestId);
    if (!request) throw new Error("Connection request not found");

    const updatedRequest = this.connectionMediator.respondToRequest(
      requestId,
      accept
    );

    if (accept) {
      this.connections.add(updatedRequest.fromUserId);
    }
    this.pendingRequests.delete(requestId);
  }

  getConnections(): string[] {
    return Array.from(this.connections);
  }

  getPendingRequests(): ConnectionRequest[] {
    return Array.from(this.pendingRequests.values());
  }

  onConnectionRequestReceived(request: ConnectionRequest): void {
    this.pendingRequests.set(request.id, request);
    console.log(
      `[${this.id}] Received new connection request from ${request.fromUserId}`
    );
  }

  onConnectionRequestUpdated(request: ConnectionRequest): void {
    console.log(
      `[${this.id}] Connection request ${request.id} updated to: ${request.status}`
    );

    if (request.status === "accepted" && request.toUserId === this.id) {
      this.connections.add(request.fromUserId);
    }

    this.pendingRequests.delete(request.id);
  }
}

export class UserProfile implements Profile {
  constructor(
    public headline: string = "",
    public skills: string[] = [],
    public summary: string = "",
    public name: string = ""
  ) {}

  describe() {
    console.log(
      `Hello ${this.name} you skill set includes ${this.skills} and your summary is ${this.summary} and your headline is ${this.headline}`
    );
  }
}

export class UserProfileBuilder {
  profile = new UserProfile();

  setSkills(skillSet: string[]) {
    this.profile.skills.push(...skillSet);
    return this;
  }

  setHeadline(headline: string) {
    this.profile.headline = headline;
    return this;
  }

  setSummary(summary: string) {
    this.profile.summary = summary;
    return this;
  }

  setName(name: string) {
    this.profile.name = name;
    return this;
  }

  build() {
    return this.profile;
  }
}

export class OAuthStrategy implements AuthStrategy {
  private validTokens = new Set(["google", "facebook", "gmail"]);
  authenticate(credentials: any) {
    return new Promise<boolean | string>((resolve, reject) => {
      setTimeout(() => {
        if (!this.validate)
          throw new Error("Invalid credentials format cannot login");
        if (this.validTokens.has(credentials)) {
          console.log("Successful authentication, logging the user");
          resolve(true);
        }
        reject("Invalid credentials cannot login");
      }, 1000);
    });
  }
  validate(credentials: any) {
    if (typeof credentials === "string") return true;
  }

  register(credentials: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.validate) throw new Error("Invalid token cannot register");
        if (this.validTokens.has(credentials))
          throw new Error("Token already exists");
        this.validTokens.add(credentials);
      }, 1000);
    });
  }
}

export class EmailPasswordStrategy implements AuthStrategy {
  private userBase = {
    "user_1@gmail.com": "password_1",
    "user_2@gmail.com": "password_2",
  };
  authenticate(credentials: any) {
    return new Promise<boolean | string>((resolve, reject) => {
      setTimeout(() => {
        if (!this.validate) reject("Invalid credentials format cannot login");
        const { email, password } = credentials;
        const userPassword = this.userBase[email];
        if (userPassword === password) {
          console.log("Successful authentication, logging the user");
          resolve(true);
        } else reject("Wrong Email or Password");
      }, 1000);
    });
  }

  validate(credentials: any) {
    if (
      typeof credentials === "object" &&
      "email" in credentials &&
      "password" in credentials
    )
      return true;
    else return false;
  }
  register(credentials: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.validate)
          throw new Error("Invalid credentials cannot register");
        const { email, password } = credentials;
        if (email in this.userBase) throw new Error("Email already exists");
        this.userBase[email] = password;
        console.log("register the user successfully");
      }, 1000);
    });
  }
}

export class BasicUserFactory extends UserFactory {
  private idCounter = 0;

  createUser(info?: any): User {
    try {
      this.idCounter++;
      return new User(
        `user_${this.idCounter}`,
        "basic",
        info?.email,
        new UserProfile()
      );
    } catch (error) {
      console.log(error, "cannot create user");
    }
  }
}

export class ConnectionRequest implements IConnectionRequest {
  constructor(
    public id: string,
    public status: EStatus,
    public fromUserId: string,
    public toUserId: string,
    public timestamp: Date
  ) {}
}

export class ConnectionMediator {
  private requests = new Map<string, IConnectionRequest>();
  private users = new Map<string, ConnectionObserver>();
  private static instance: ConnectionMediator;

  constructor() {}

  static getInstance() {
    if (!ConnectionMediator.instance) {
      ConnectionMediator.instance = new ConnectionMediator();
    }
    return ConnectionMediator.instance;
  }

  addObserver(user: ConnectionObserver & User) {
    this.users.set(user.id, user);
  }

  removeObserver(user: User) {
    this.users.delete(user.id);
  }

  createRequest(sender: string, receiver: string) {
    if (sender === receiver) {
      throw new Error("Cannot send connection request to yourself");
    }

    const existingRequest = Array.from(this.requests.values()).find(
      (req) =>
        (req.fromUserId === sender && req.toUserId === receiver) ||
        (req.fromUserId === receiver && req.toUserId === sender)
    );

    if (existingRequest) {
      throw new Error("Connection request already exists between these users");
    }

    const requestId = `conn_${Date.now()}_${Math.random().toString(36)}`;
    const newRequest = new ConnectionRequest(
      requestId,
      EStatus.pending,
      sender,
      receiver,
      new Date()
    );

    this.requests.set(newRequest.id, newRequest);
    this.notifyUser(receiver, newRequest);
    return newRequest;
  }

  respondToRequest(requestId: string, accept: boolean): ConnectionRequest {
    const request = this.requests.get(requestId);
    if (!request) throw new Error("Connection request not found");

    if (request.status !== "pending") {
      throw new Error("Connection request already processed");
    }

    request.status = accept ? EStatus.accepted : EStatus.rejected;
    this.requests.set(requestId, request);

    // Notify both parties
    this.notifyUser(request.fromUserId, request);
    this.notifyUser(request.toUserId, request);

    return request;
  }

  private notifyUser(userId: string, request: ConnectionRequest) {
    const user = this.users.get(userId);
    if (user) {
      if (userId === request.toUserId && request.status === "pending") {
        user.onConnectionRequestReceived(request);
      } else {
        user.onConnectionRequestUpdated(request);
      }
    }
  }
}
