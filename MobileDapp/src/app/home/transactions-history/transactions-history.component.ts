import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiServiceService } from 'src/services/api-service.service';

@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {

  transactions: any;
  transactionCards = []


  constructor(private apiService: ApiServiceService, 
              private alertController: AlertController,
              private loadingController: LoadingController) { }

  ngOnInit(): void {
    this.getTransactions()
  }

  getTransactions() {
    this.apiService.getTransactions().subscribe(meta =>{ 
      let data:any = meta;
      this.transactionCards = data['transactions'];
      console.log(data)
    });
  }

  async approve(trans:any){
    let approve = await this.alertController.create({
      header: "Approve Escrow Payment?",
      message: "Please confirm payment should be released to receiver",
      buttons:[{
        text: "Confirm",
        handler: ()=>{
          this.showProgressSpinner()
          this.apiService.postEscrowClear(trans.counterAccount).subscribe(meta => {
            let data:any = meta;
            console.log(data);
            this.loadingController.dismiss();
            this.getTransactions();
          });
        }
      }, "Cancel"]
    });
    await approve.present();
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

}
