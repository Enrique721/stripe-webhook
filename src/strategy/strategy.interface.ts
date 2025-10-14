import Stripe from "stripe";

export interface IStrategy {

    parseObject(eventStripe: Stripe.Event): any;

    //  parsed object
    doOperation(parsedObject: any): any;
}