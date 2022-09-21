import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

import { AlertController, LoadingController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';

import { Web3Auth } from "@web3auth/web3auth";

import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "./../config/chains";
import { WEB3AUTH_NETWORK_TYPE } from "./../config/web3auth-networks";
import { getWalletProvider, IWalletProvider } from "./../services/wallet-provider";

import { UserServiceService } from "src/services/user-service.service";

import UAuth from '@uauth/js'

const uauth = new UAuth({
  clientID: "827c788a-979f-4949-88cf-2d653ad16326",
  redirectUri: "https://celo-remit.vercel.app/home"
});

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit{

  isLoggedIn!: boolean;

  domain: any = "none@none.none";

  isModalLoaded = false;

  user: string = ""

  constructor(private loadingController: LoadingController,
    private apiService: ApiServiceService,
    private userService: UserServiceService,
    private alertController: AlertController
    ) {
      this.isLoggedIn = userService.getUserLoginStatus()
      this.initAppToBackend()
    }
    
  ngOnInit(): void {}

  initAppToBackend(){
    console.log("before init")
    this.apiService.initializeFrontendWithServer().subscribe(async meta =>{
      let data:any = meta;
      console.log(data);
      let result:string = data['response']
      let message = data['message']
      console.log(result)
      if (result.toLowerCase() == 'ok'){
        console.log("after init")
      }
    }, async (error)=> {
      let alert = await this.alertController.create({
        header: "Error",
        message: "Could not establish connection with server. Please close and reopen the app.",
        backdropDismiss: true
      })

      await alert.present();
    })
  }

  async showProgressSpinner(info:string){
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      message: info,
      translucent: false,
      backdropDismiss: false
      }
    );
    await loading.present()
  }

  async dismissLoadingController(){
    await this.loadingController.dismiss()
  }
  
  async setAccount(user:any){
    this.apiService.getUser(user).subscribe(
      meta => {
        let data:any = meta;
        console.log(data)
        this.isLoggedIn = this.apiService.setUsernameAndAccount(data['account_metadata'].customer_id, data['account_metadata'].account_id)
        this.userService.setUserLoginStatus(this.isLoggedIn)
        console.log(this.isLoggedIn)
      }, async (error) => {
        let alert = await this.alertController.create({
          header: "Error",
          message: "Could not establish connection with server. Please close and reopen the app.",
          backdropDismiss: true
        })
        await alert.present();
      }
    );
  }
  
  getLoginState(){
    this.isLoggedIn = this.userService.getUserLoginStatus();
  }

  setLoginState(state: boolean){
    this.userService.setUserLoginStatus(state);
    this.isLoggedIn = this.userService.getUserLoginStatus();
  }

  login(){
    if(this.user == ""){
      this.user = "test.wallet"
    }
    this.setAccount(this.user)
  }

  async loginWithUnstoppable(){
    try{
      const authorization = await uauth.loginWithPopup()
      console.log(authorization)
      this.setAccount(authorization.idToken.sub)
    }catch(error){
      console.log(error);
    }
    
  }

}
