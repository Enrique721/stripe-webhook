import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";

export class ChargeStrategy implements IStrategy {

    constructor() { }

    async doOperation(eventStripe: Stripe.Event) {
        switch (eventStripe.type) {

            case "charge.succeeded":
                return
        }
    }

    // Used to capture the last four assuming its card number
    async chargeSucceeded() {
        return;
    }

}