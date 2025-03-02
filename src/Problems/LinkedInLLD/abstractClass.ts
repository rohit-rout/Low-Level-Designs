import { User } from "./concreteClass.js";
import { AuthStrategy } from "./interface.js";

export abstract class CustomModule {
    abstract run(): void;
}


export abstract class UserFactory {
    abstract createUser(type: 'basic' | 'premium',info?:any): User;

    async login(credentials: any,auth:AuthStrategy) {
        try {
            await auth.authenticate(credentials);
        } catch (error) {
            console.log(error);
        }
    }

    async register(credentials: any, auth:AuthStrategy) {
        try {
            auth.register(credentials);
            return this.createUser(credentials);
        } catch (error) {
            console.log(error);
        }
       
    }
}