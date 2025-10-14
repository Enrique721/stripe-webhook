import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";

export class CustomerStrategy implements IStrategy {

    parseObject(eventStripe: Stripe.Event) {
        
    }

    doOperation(parsedObject: any) {
        
    }
}