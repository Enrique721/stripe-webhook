import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PlanStrategy implements IStrategy {

    doOperation(eventStripe: Stripe.Event) {
    }
}