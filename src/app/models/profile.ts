import { User } from "./User";

export interface IProfile {
    userName: string;
    displayName: string;
    bio?: string;
    image?: string;
}

export class Profile implements IProfile {
    constructor (user: User) {
        this.userName = user.userName
        this.displayName = user.displayName
        this.image = user.image
    }

    userName: string;
    displayName: string;
    bio?: string;
    image?: string;
}