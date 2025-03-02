import { UserFactory } from "./abstractClass.js";
import { AuthStrategy, Profile } from "./interface.js";

export class User {
    constructor(public id: string , public type : 'basic' | 'premium', public email: string, public profile: Profile) {}

     describe() {
        return this.profile.describe();
     }

     updateProfile(updateProfile: Profile) {
        this.profile = updateProfile;
     }
}

export class UserProfile implements Profile{
    constructor(
        public headline: string='',
        public skills: string[]=[],
        public summary : string ='',
        public name : string = ''
    ) {}

    describe() {
        console.log(`Hello ${this.name} you skill set includes ${this.skills} and your summary is ${this.summary} and your headline is ${this.headline}`);
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

     build () {
        return this.profile;
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
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                if(!this.validate) throw new Error('Invalid token cannot register');
                if(this.validTokens.has(credentials)) throw new Error('Token already exists');
                this.validTokens.add(credentials);
            },1000)
        })
    
    }
}


export class EmailPasswordStrategy implements AuthStrategy {
    private userBase = {
        'user_1@gmail.com': 'password_1',
        'user_2@gmail.com': 'password_2'
    }
    authenticate(credentials: any) {
        return new Promise<boolean | string>((resolve, reject)=>{
            setTimeout(()=>{
                if(!this.validate) reject('Invalid credentials format cannot login');
                const {email,password} = credentials;
                const userPassword = this.userBase[email];
                if(userPassword === password) {
                    console.log('Successful authentication, logging the user');
                    resolve(true);
                }
                else reject('Wrong Email or Password');
            },1000)
        })
     }

    validate(credentials: any) {
        if(typeof credentials === 'object' && 'email' in credentials && 'password' in credentials) return true;
        else return false;
     }
    register(credentials: any) {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(!this.validate) throw new Error('Invalid credentials cannot register');
                const {email,password} = credentials;
                if(email in this.userBase) throw new Error('Email already exists');
                this.userBase[email] = password;
                console.log('register the user successfully');
            },1000)
        })
   
    }
}

export class BasicUserFactory extends UserFactory {
    private idCounter = 0;
    
    createUser(info?:any): User {
        try {
            this.idCounter++;
            return new User(
                `user_${this.idCounter}`,
                'basic',
                info?.email,
                new UserProfile()
                );
        } catch (error) {
            console.log(error,'cannot create user');
        }
      
    }
}
