import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../environments/environment';
import { Platform } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  API_URL: string;
  username: string = '';
  userAccount: string = '';
  userContacts: string[] = [];

  accountBalance: string = '';
  accountAvailableBalance: string = '';

  constructor(private http: HttpClient,
    private platform: Platform) {
      this.API_URL = environment.urlLocal;
    }

  setUsernameAndAccount(username:string, account:string){this.username = username; this.userAccount = account; return true;}

  initializeFrontendWithServer(){
    this.http.get(this.API_URL+'/initialize', {headers:{'X-Api-Key': '3d59cd80-9957-4423-8d5e-974bc98af2c0_100'}}).subscribe( data => {
      let response: any = data;
    })
    return this.http.get(this.API_URL+'/server-state')
  }

  getUser(username:string) { return this.http.get(this.API_URL+`/user/`+username); }

  getContacts() { return this.http.get(this.API_URL+`/contacts/`+this.username) }

  getBalance() {
    return this.http.get(this.API_URL+`/balance/`+this.username)
  }

  getTransactions() {
    return this.http.get(this.API_URL+`/transactions/`+this.username);
  }

  postTopUp(topUpAmount: string) {
    let body = { "amount": topUpAmount };
    return this.http.post(this.API_URL+`/top-up/`+this.username, body);
  }

  postPayment(payAmount: string, receiver: string, username:string) {
    let body = {
      "amount": payAmount,
      "receiver": receiver,
      "username": username,
      "type": "NORMAL"
    }
    return this.http.post(this.API_URL+`/payment/`+this.username, body);
  }

  postEscrowPayment(payAmount: string, receiver: string, username:string) {
    let body = {
      "amount": payAmount,
      "receiver": receiver,
      "username": username,
      "type": "ESCROW"
    }
    return this.http.post(this.API_URL+`/escrow-pay/`+this.username, body)
  }

  postEscrowClear(receiverId: string) {
    let body = {
      "receiver": receiverId,
    }
    return this.http.post(this.API_URL+`/escrow-clear/`+this.username, body);
  }

  postStakeAmount(amount: string, duration: string){
    let body = {
      amount: amount,
      duration: duration
    }
    return this.http.post(this.API_URL+`/stake/`+this.username, body);
  }

  postBorrowAmount(amount: string){
    let body = {
      amount: amount,
    }
    return this.http.post(this.API_URL+`/borrow/`+this.username, body);
  }

}
