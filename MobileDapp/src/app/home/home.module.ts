import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CreateQrComponent } from './create-qr/create-qr.component';
import { ScanPaymentComponent } from './scan-payment/scan-payment.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ContactsComponent } from './contacts/contacts.component';
import { TransakCryptoPurchaseComponent } from './transak-crypto-purchase/transak-crypto-purchase.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { StakeCusdComponent } from './stake-cusd/stake-cusd.component';
import { BorrowCusdComponent } from './borrow-cusd/borrow-cusd.component';
import { WithdrawCusdComponent } from './withdraw-cusd/withdraw-cusd.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxQRCodeModule,
    HttpClientModule,
  ],
  declarations: [HomePage,CreateQrComponent,ScanPaymentComponent,ContactsComponent, TransakCryptoPurchaseComponent, TransactionsHistoryComponent, StakeCusdComponent, BorrowCusdComponent, WithdrawCusdComponent],
  providers: [BarcodeScanner]
})
export class HomePageModule {}
