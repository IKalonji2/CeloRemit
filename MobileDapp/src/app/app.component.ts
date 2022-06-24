import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

import { AlertController, LoadingController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';

import { ADAPTER_EVENTS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/web3auth";

import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "./../config/chains";
import { WEB3AUTH_NETWORK_TYPE } from "./../config/web3auth-networks";
import { getWalletProvider, IWalletProvider } from "./../services/wallet-provider";

import { UserServiceService } from "src/services/user-service.service";

const clientId = "BD-o_TdBHjHOuKoRHvkouRcFDB00aToIftvdiET5nu4kcdrx0C-_yZP668ojVA2OZp03wGDajoKTuHMz-R4Uq2s";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit{

  chain: CHAIN_CONFIG_TYPE = "mainnet";

  network: WEB3AUTH_NETWORK_TYPE = "cyan";

  isLoggedIn!: boolean;

  domain: any = "none@none.none";

  web3auth: Web3Auth | null = null;

  isModalLoaded = false;

  provider: IWalletProvider | null = null;

  user: string = ""

  constructor(private loadingController: LoadingController,
    private apiService: ApiServiceService,
    private userService: UserServiceService,
    private alertController: AlertController
    ) {

      // this.web3auth = new Web3Auth({
      //   clientId,
      //   chainConfig: CHAIN_CONFIG[this.chain],
      // });
      this.isLoggedIn = userService.getUserLoginStatus()
      this.initAppToBackend()
    }
    
  ngOnInit(): void {

    // const subscribeAuthEvents = (web3auth: Web3Auth) => {
    //   web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
    //     console.log("Yeah!, you are successfully logged in", data);
    //     this.setLoginStatus(true);
    //   });

    //   web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    //     console.log("connecting");
    //   });

    //   web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
    //     console.log("disconnected");
    //     this.setLoginStatus(false);
    //   });

    //   web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
    //     console.log("some error or user have cancelled login request", error);
    //   });
    // };

  //   const initializeModal = async () => {
  //     console.log("INIT MODAL");
  //     this.web3auth = new Web3Auth({
  //       clientId,
  //       chainConfig: CHAIN_CONFIG[this.chain],
  //     });
  //     const adapter = new OpenloginAdapter({ adapterSettings: { network: this.network, clientId } });
  //     this.web3auth.configureAdapter(adapter);

  //     subscribeAuthEvents(this.web3auth);
  //     await this.web3auth.initModal();
  //     this.isModalLoaded = true;

  //     if (this.isLoggedIn && !this.provider) {
  //       const web3authProvider = await this.web3auth.connect();
  //       if (web3authProvider) this.provider = getWalletProvider(this.chain, web3authProvider, this.uiConsole);
  //     }
  //   };
  //   initializeModal();
  // }

  // selectChain(chain: string) {
  //   this.chain = chain as CHAIN_CONFIG_TYPE;
  // }

  // selectNetwork(network: string) {
  //   this.network = network as WEB3AUTH_NETWORK_TYPE;
  // }

  // setLoginStatus(status: boolean) {
  //   this.isLoggedIn = status;
  //   this.setLoginState(status)
  }

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
  // async loginWeb3Auth() {
  //   console.log("LOGGING IN");
  //   this.setLoginState(true)
  //   if (!this.web3auth) {
  //     console.log("Web3auth is not initialized");
  //     return;
  //   }
  //   const web3authProvider = await this.web3auth.connect();
  //   if (web3authProvider){
  //     this.provider = getWalletProvider(this.chain, web3authProvider, this.uiConsole);
  //     console.log(this.provider)
  //     this.getUserInfo();
  //   } 
  //   this.getUserInfo()
  // }

  // async logout() {
  //   console.log("LOGGING OUT");
  //   if (!this.web3auth) {
  //     console.log("Web3auth is not initialized");
  //     return;
  //   }
  //   await this.web3auth.logout();
  //   this.provider = null;
  //   this.isLoggedIn = false;
  // }

  // async getUserInfo() {
  //   console.log("GETTING USER INFO");
  //   if (!this.web3auth) {
  //     console.log("Web3auth is not initialized");
  //     return;
  //   }
  //   const userInfo = await this.web3auth.getUserInfo();
  //   console.log(userInfo)
  //   let user = userInfo.email;
  //   console.log(this.domain)
  //   this.setAccount(user);
  //   this.uiConsole("User Info", userInfo);
  // }

  // async getBalance() {
  //   console.log("GETTING ACCOUNT BALANCE");
  //   if (!this.provider) {
  //     this.uiConsole("provider is not initialized");
  //     return;
  //   }
  //   this.provider.getBalance();
  // }

  // async getAccount() {
  //   console.log("GETTING ACCOUNT");
  //   if (!this.provider) {
  //     this.uiConsole("provider is not initialized");
  //     return;
  //   }
  //   this.provider.getAccounts();
  // }

  // async signMessage() {
  //   console.log("SIGNING MESSAGE");
  //   if (!this.provider) {
  //     this.uiConsole("provider is not initialized");
  //     return;
  //   }
  //   this.provider.signMessage();
  // }

  // uiConsole(...args: unknown[]): void {
  //   const el = document.querySelector("#console-ui>p");
  //   if (el) {
  //     el.innerHTML = JSON.stringify(args || {}, null, 2);
  //   }
  // }


}
