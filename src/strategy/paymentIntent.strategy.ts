import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";

export class PaymentIntentStrategy implements IStrategy {

    parseObject(eventStripe: Stripe.Event) {
    }

    doOperation(parsedObject: any) {
        
    }
}