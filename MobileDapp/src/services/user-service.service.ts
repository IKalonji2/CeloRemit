import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class UserServiceService {

    userLoggedIn = false;

    constructor(){}

    setUserLoginStatus(loggedIn:boolean){
        this.userLoggedIn = loggedIn;
    }

    getUserLoginStatus(): boolean{
        return this.userLoggedIn;
    }
    
}