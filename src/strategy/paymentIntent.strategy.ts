import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentIntentStrategy implements IStrategy {


    doOperation(eventStripe: Stripe.Event) {

        switch (eventStripe.type) {
            case "payment_intent.created":
                return;
            case "payment_intent.canceled":
                return;
            case "payment_intent.payment_failed":
                return;
        }
    }
}