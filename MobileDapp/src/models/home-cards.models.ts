import { ScanPaymentComponent } from "../app/home/scan-payment/scan-payment.component";
import { CreateQrComponent } from "../app/home/create-qr/create-qr.component";
import { TransakCryptoPurchaseComponent } from "src/app/home/transak-crypto-purchase/transak-crypto-purchase.component";
import { WithdrawCusdComponent } from "src/app/home/withdraw-cusd/withdraw-cusd.component";
import { StakeCusdComponent } from "src/app/home/stake-cusd/stake-cusd.component";
import { BorrowCusdComponent } from "src/app/home/borrow-cusd/borrow-cusd.component";


export const HomePageCards = [
    {
        icon: "cash-outline",
        name: "Send",
        component: ScanPaymentComponent
    },
    {
        icon: "qr-code-outline",
        name: "Receive",
        component: CreateQrComponent
    },
    {
        icon: "pricetag-outline",
        name: "Buy cUSD",
        component: TransakCryptoPurchaseComponent
    },
    {
        icon: "card-outline",
        name: "Withdraw",
        component: ScanPaymentComponent
    },
    {
        icon: "bag-add-outline",
        name: "Stake cUSD",
        component: StakeCusdComponent
    },
    {
        icon: "wallet-outline",
        name: "Borrow cUSD",
        component: BorrowCusdComponent
    },
]
