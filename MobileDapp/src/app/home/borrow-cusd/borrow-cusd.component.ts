import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiServiceService } from 'src/services/api-service.service';

@Component({
  selector: 'app-borrow-cusd',
  templateUrl: './borrow-cusd.component.html',
  styleUrls: ['./borrow-cusd.component.css']
})
export class BorrowCusdComponent implements OnInit {

  amount: string = ""

  constructor(private apiService: ApiServiceService, private modalObject: ModalController) { }

  ngOnInit(): void {
  }

  borrowCusd(){
    this.apiService.postBorrowAmount(this.amount).subscribe(data => {
      let response : any = data;

      console.log(response)

      this.modalObject.dismiss();
    })
  }

}
