import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UserServiceService } from 'src/services/user-service.service';
import { HomePageCards } from '../../models/home-cards.models';
import { ApiServiceService } from '../../services/api-service.service';
import { ContactsComponent } from './contacts/contacts.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  
  cardRows = HomePageCards;
  userAccount : string = '';
  balanceData: any;

  balance: any;
  available: any;
  staked: any;
  outstanding: any;
  tree_points: any;

  username: string = ''

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private apiService: ApiServiceService,
    public loadingController: LoadingController,
    private userService: UserServiceService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // console.log("home init");
    this.username = this.apiService.username;
    this.userAccount = this.apiService.userAccount;
    this.updateBalance();
  }

  async displayModal(row:any){
    console.log(row)
    let componentToLoad;

    switch(row){
      case "contacts":
        componentToLoad = ContactsComponent
        break;
      case "transactions": 
        componentToLoad = TransactionsHistoryComponent
        break;
      case "logout": 
        componentToLoad = this
        break;
      default:
        componentToLoad = row.component;
    }
    
    const account = await this.modalController.create(
      {
        component: componentToLoad,
        showBackdrop: true,
        cssClass: "my-custom-modal-css",
        backdropDismiss: true,
        swipeToClose: true
      }
    );

    account.onDidDismiss().then(()=>{
      this.updateBalance();
      }
    )

    return await account.present()
  }

  async showProgressSpinner(){
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      message: 'Loading account, please wait',
      translucent: false,
      backdropDismiss: false
    });
    await loading.present()
  } 

  updateBalance() {
    this.balanceData = this.apiService.getBalance().subscribe(meta =>{
      let data:any = meta;
      this.balance = data['balance'].accountBalance;
      this.available = data['balance'].availableBalance;
      this.tree_points = data['balance'].tree_points;
      this.outstanding = data['balance'].outstanding;
      this.staked = data['balance'].staked;
      console.log(data)
    });
  }

  logout(){
    this.userService.setUserLoginStatus(false)
    window.location.reload();
  }

}