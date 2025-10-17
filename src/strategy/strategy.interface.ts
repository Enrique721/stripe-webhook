import Stripe from "stripe";

export interface IStrategy {

    //  parsed object
    doOperation(eventStripe: Stripe.Event): any;

/*     initialcreateorupdate(eventStripe: Stripe.Event): any; */
}