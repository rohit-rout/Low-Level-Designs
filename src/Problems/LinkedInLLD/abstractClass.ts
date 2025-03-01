import { User } from "./concreteClass.js";

export abstract class CustomModule {
    abstract run(): void;
}


export abstract class UserFactory {
    abstract createUser(type: 'basic' | 'premium'): User;

    async login(credentials: any,auth:any) {
        try {
           await auth.authenticate(credentials); 
        
        } catch (error) {
            console.log(error);
        }
    }

    register(credentials: any, auth:any) {
        try {
            auth.register(credentials);
            return this.createUser('basic');
        } catch (error) {
            console.log(error);
        }
       
    }
}