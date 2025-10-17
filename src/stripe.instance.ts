import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class stripeInstance implements OnModuleInit {

    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        try {
            const privateKey = this.configService.get<string>("stripe.privateKey");

            if (!privateKey)
                throw new Error("Require private stripe key");

            this.stripe = new Stripe(privateKey,
                { apiVersion: "2025-09-30.clover" }
            );
        } catch (e) {
            console.error(e.message);
        }
    }

    getStripeInstance() {
        return this.stripe;
    }
}