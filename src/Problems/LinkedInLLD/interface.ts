export interface AuthStrategy {
    authenticate(credentials: any) : Promise<string | boolean>;
    validate(credentials: any) : boolean;
    register(credentials: any): void;
}

export interface Profile {
    name:string;
    headline: string;
    skills: string[];
    summary: string;
    describe():void;
}