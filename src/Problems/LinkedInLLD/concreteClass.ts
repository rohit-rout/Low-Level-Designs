export class User {
    constructor(public id: string , public type : 'basic' | 'premium') {}

     getProfile() {
        console.log('user id is', this?.id);
    }
}