import { BillingStrategy } from "./billing.strategy";
import { CustomerStrategy } from "./customer.strategy";
import { InvoiceStrategy } from "./invoice.strategy";
import { PaymentIntentStrategy } from "./paymentIntent.strategy";
import { PaymentMethodStrategy } from "./paymentMethod.strategy";
import { PriceStrategy } from "./price.strategy";
import { ProductStrategy } from "./product.strategy";
import { IStrategy } from "./strategy.interface";

export type EventMainClassType = "billing"
                                | "payment_intent"
                                | "invoice"
                                | "customer"
                                | "payment_method"
                                | "price"
                                | "product"

export class StrategyStorage {

    constructor(
        private readonly billingStrategy: BillingStrategy,
        private readonly customerStrategy: CustomerStrategy,
        private readonly invoiceStrategy: InvoiceStrategy,
        private readonly paymentIntentStrategy: PaymentIntentStrategy,
        private readonly paymentMethodStrategy: PaymentMethodStrategy,
        private readonly priceStrategy: PriceStrategy,
        private readonly productStrategy: ProductStrategy,
    ) {}

    getStrategy(mainClass: EventMainClassType): IStrategy {
        switch (mainClass) {
            case "billing":
                return this.billingStrategy;

            case "customer":
                return this.customerStrategy;

            case "invoice":
                return this.invoiceStrategy;

            case "payment_intent":
                return this.paymentIntentStrategy;

            case "payment_method":
                return this.paymentMethodStrategy;

            case "price":
                return this.priceStrategy;

            case "product":
                return this.productStrategy;

            default:
                throw new Error(`Unknown event class: ${mainClass}`);
        }
    }
}