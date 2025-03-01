import { UserFactory } from "./abstractClass.js";

export class User {
    constructor(public id: string , public type : 'basic' | 'premium') {}

     getProfile() {
        console.log('user id is', this?.id);
    }
}


export class OAuthStrategy implements AuthStrategy {
    private validTokens =  new Set(['google','facebook','gmail']);
    authenticate(credentials: any) { 
        return new Promise<boolean | string>((resolve, reject)=>{
            setTimeout(()=>{
                if(!this.validate) throw new Error('Invalid credentials format cannot login');
                if(this.validTokens.has(credentials)) {
                    console.log('Successful authentication, logging the user');
                    resolve(true);
                }
                reject('Invalid credentials cannot login');
            },1000)
        })   
    }
    validate(credentials: any) { 
        if(typeof credentials === 'string') return true;
    }

    register(credentials: any) {
        if(!this.validate) throw new Error('Invalid token cannot register');
        if(this.validTokens.has(credentials)) throw new Error('Token already exists');
        this.validTokens.add(credentials);
    }
}


export class EmailPasswordStrategy implements AuthStrategy {
    private userBase = {
        'user_1@gmail.com': 'password_1',
        'user_2@gmail.com': 'password_2'
    }
    authenticate(credentials: any) {
        return new Promise<boolean | string>((resolve, reject)=>{
            if(!this.validate) reject('Invalid credentials format cannot login');
            const {email,password} = credentials;
            const userPassword = this.userBase[email];
            if(userPassword === password) resolve(true);
            else reject('Wrong Email or Password');
        })
       
     }
    validate(credentials: any) {
        if(typeof credentials === 'object' && 'email' in credentials && 'password' in credentials) return true;
        else return false;
     }
    register(credentials: any) {
        if(!this.validate) throw new Error('Invalid credentials cannot register');
        const {email,password} = credentials;
        if(email in this.userBase) throw new Error('Email already exists');
        this.userBase[email] = password;
        console.log('register the user successfully');
    }
}

export class BasicUserFactory extends UserFactory {
    private idCounter = 0;
    
    createUser(type: 'basic' | 'premium'): User {
        this.idCounter++;
        return new User(
            `user_${this.idCounter}`,
            type
        );
    }
}
