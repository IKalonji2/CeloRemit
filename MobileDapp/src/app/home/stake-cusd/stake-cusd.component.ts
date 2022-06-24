import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiServiceService } from 'src/services/api-service.service';

@Component({
  selector: 'app-stake-cusd',
  templateUrl: './stake-cusd.component.html',
  styleUrls: ['./stake-cusd.component.css']
})
export class StakeCusdComponent implements OnInit {

  amount: string = "";
  duration: string = "";

  constructor(private apiService:ApiServiceService, private modalObject: ModalController) { }

  ngOnInit(): void {
  }

  setDuration(event:any){
    this.duration = event.detail.value;
  }

  submitStake(){
    this.apiService.postStakeAmount(this.amount, this.duration).subscribe(data => {
      let response: any = data;
      this.modalObject.dismiss()
    })
  }

}
