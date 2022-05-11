import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiServiceService } from 'src/services/api-service.service';

@Component({
  selector: 'app-transak-crypto-purchase',
  templateUrl: './transak-crypto-purchase.component.html',
  styleUrls: ['./transak-crypto-purchase.component.css']
})
export class TransakCryptoPurchaseComponent implements OnInit {

  constructor(private modal: ModalController, private apiService: ApiServiceService) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.modal.dismiss()
    this.apiService.postTopUp("118").subscribe(meta =>{
      let data:any = meta;
      console.log(data);
    })
  }
}



