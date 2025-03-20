export interface AuthStrategy {
  authenticate(credentials: any): Promise<string | boolean>;
  validate(credentials: any): boolean;
  register(credentials: any): void;
}

export interface Profile {
  name: string;
  headline: string;
  skills: string[];
  summary: string;
  describe(): void;
}

export interface ConnectionObserver {
  onConnectionRequestReceived(request: IConnectionRequest): void;
  onConnectionRequestUpdated(request: IConnectionRequest): void;
}

export interface IConnectionRequest {
  id: string;
  status: EStatus;
  fromUserId: string;
  toUserId: string;
  timestamp: Date;
}

export enum EStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}
