import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerStrategy implements IStrategy {

    parseObject(eventStripe: Stripe.Event) {
        
    }

    doOperation(eventStripe: Stripe.Event) {
        switch (eventStripe.type) {
            case "customer.subscription.created":
                return;
            case "customer.subscription.deleted":
                return;
            case "customer.subscription.paused":
                return;
        }
    }
}