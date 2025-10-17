import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";
import { ProductSubscription } from "src/schema/stripeSchema/TypeOfSubscription.schema";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { stripeInstance } from "src/stripe.instance";

@Injectable()
export class PriceStrategy implements IStrategy {

    constructor(
        @InjectModel("subscriptiontypes", "Dash")
        private readonly subscriptionTypes: Model<ProductSubscription>,

        private readonly stripeInstanceService: stripeInstance,
    ) { }


    async doOperation(eventStripe: Stripe.Event) {

        switch (eventStripe.type) {
            case "price.created":
                return await this.initialcreateorupdate(eventStripe);

            case "price.updated":
                return await this.updatePrice(eventStripe);

            case "price.deleted":
                return await this.disablePriceObject(eventStripe);
        }
    }

    async initialcreateorupdate(eventStripe: Stripe.PriceCreatedEvent) {
        const priceStripe: Stripe.Price = eventStripe.data.object;

        try {
            const result = await this.subscriptionTypes.updateOne(
                { stripeProductId: priceStripe.product },
                {
                    $setOnInsert: {
                        stripeProductId: priceStripe.product,
                    },
                    $push: {
                        priceList: {
                            price: priceStripe.unit_amount,
                            currency: priceStripe.currency,
                            priceId: priceStripe.id,
                            type: priceStripe.type,
                            enable: priceStripe.active,
                            billingScheme: priceStripe.billing_scheme,
                            billingInterval: priceStripe.recurring?.interval || "",
                            title: priceStripe.nickname,
                            updated: -1,
                        }
                    }
                },
                { upsert: true }
            );
            
            if (!result.acknowledged ||
                (result.modifiedCount === 0 && result.upsertedCount === 0))
                throw new InternalServerErrorException("Failed to insert or update");
        } catch (e) {
            console.error(e);
            console.error("Failed to insert price information in the product in the DB");
            throw new InternalServerErrorException();
        }
    }

    async updatePrice(eventStripe: Stripe.PriceUpdatedEvent) {

        const priceStripe: Stripe.Price = eventStripe.data.object;
        const priceStripeId: string = priceStripe.id;
        const changedFields: Partial<Stripe.Price> | undefined = eventStripe.data.previous_attributes;

        if (!changedFields)
            return ;

        const targetField = {
            "unit_amount": "priceList.$.price",
            "currency": "priceList.$.currency",
            "type": "priceList.$.type",
            "active": "priceList.$.enable",
            "billing_scheme": "priceList.$.billingScheme",
            "nickname": "priceList.$.title",
        };

        const targetKeys: string[] = Array.from(Object.keys(targetField));

        const hasTargetKeys: boolean = Array.from(Object.keys(changedFields))
                                                .some(key =>
                                                    targetKeys.some(field => field === key));
        
        if (!hasTargetKeys) {
            console.error("There is nothing to update in the price data");
            return;
        }

        const retrieveObject = await this.retrievePriceObject(priceStripeId);
        const updateObject = {};

        for (let key of targetKeys) {
            updateObject[targetField[key]] = retrieveObject[key];
        }
        console.log(updateObject);

        const result: UpdateWriteOpResult = await this.subscriptionTypes.updateOne(
            { stripeProductId: priceStripe.product, "priceList.priceId": priceStripe.id },
            { $set: updateObject }
        );
        
        if (!result.acknowledged) { 
            console.error("Price update operation failed");
            throw new InternalServerErrorException();
        }
    }

    private async retrievePriceObject(priceStripeId: string): Promise<Stripe.Price> {
        const stripeInstance = this.stripeInstanceService.getStripeInstance();
        const retrieveObject: Stripe.Price = await stripeInstance.prices.retrieve(priceStripeId);
        return retrieveObject;
    }

    private async disablePriceObject(eventStripe: Stripe.PriceDeletedEvent) {
        const stripePrice: Stripe.Price = eventStripe.data.object;
        const stripePriceId: string = stripePrice.id;
        const stripeProductId: string = stripePrice.product as string;

        const result = await this.subscriptionTypes.updateOne(
            { stripeProductId: stripeProductId, "priceList.priceId": stripePriceId },
            { $set: {"priceList.$.enable": false} }
        );

        if (!result.acknowledged) {
            console.error("Failed to disable price");
            throw new InternalServerErrorException();
        }

    }
}        