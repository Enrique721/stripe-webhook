import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";

export class PriceStrategy implements IStrategy {

    parseObject(eventStripe: Stripe.Event) {
    }

    doOperation(parsedObject: any) {
    }
}        