interface AuthStrategy {
    authenticate(credentials: any) : Promise<string | boolean>;
    validate(credentials: any) : boolean;
    register(credentials: any): void;
}