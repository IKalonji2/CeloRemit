import { ScanPaymentComponent } from "../app/home/scan-payment/scan-payment.component";
import { CreateQrComponent } from "../app/home/create-qr/create-qr.component";


export const HomePageCards = [
    {
        icon: "cash-outline",
        name: "Payment",
        component: ScanPaymentComponent
    },
    {
        icon: "qr-code-outline",
        name: "Show Pay QR",
        component: CreateQrComponent
    },
]
