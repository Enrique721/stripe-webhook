import Stripe from "stripe";

import {
    Model,
    UpdateWriteOpResult
} from "mongoose";

import {
    Injectable,
    InternalServerErrorException
} from "@nestjs/common";

import { IStrategy } from "./strategy.interface";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSubscription } from "src/schema/stripeSchema/TypeOfSubscription.schema";

import { stripeInstance } from "src/stripe.instance";

@Injectable()
export class ProductStrategy implements IStrategy {

    constructor(
        @InjectModel("subscriptiontypes", "Dash")
        private readonly subscriptionTypes: Model<ProductSubscription>,
        private readonly stripeInstanceService: stripeInstance,
    ) { }

    async doOperation(eventStripe: Stripe.Event) {
        switch (eventStripe.type) {
            case "product.created":
                return await this.initialcreateorupdate(eventStripe);

            case "product.updated":
                return await this.updateProductDetail(eventStripe);

            case "product.deleted":
                return await this.disableProduct(eventStripe);
        }
    }

    async initialcreateorupdate(eventStripe: Stripe.ProductCreatedEvent) {
        const productStripe: Stripe.Product = eventStripe.data.object;

        try {
            const result = await this.subscriptionTypes.updateOne(
                { stripeProductId: productStripe.id },
                {
                    $setOnInsert: {
                        stripeProductId: productStripe.id,
                    },
                    $set: {
                        title: productStripe.name,
                        enable: productStripe.active,
                        description: productStripe.description ?? "",
                        tier: productStripe.metadata?.tier ?? "",
                    }
                },
                { upsert: true }
            );

            if (!result.acknowledged ||
                (result.modifiedCount === 0 && result.upsertedCount === 0))
                throw new InternalServerErrorException();

        } catch (e) {
            console.error(e);
            console.error("Failed to create or complement the product entry in the DB");
            throw new InternalServerErrorException();
        }
    }

    async updateProductDetail(eventStripe: Stripe.ProductUpdatedEvent) {

        const stripeInstance = this.stripeInstanceService.getStripeInstance();
        const productStripe: Stripe.Product = eventStripe.data.object;
        const changedFields: Partial<Stripe.Product> | undefined = eventStripe.data.previous_attributes;

        if (!changedFields)
            return;

        const retrievedProduct = await stripeInstance.products.retrieve(productStripe.id);

        // Set new timestamp
        const result: UpdateWriteOpResult = await this.subscriptionTypes.updateOne(
            { stripeProductId: productStripe.id },
            {
                $set: {
                    title: retrievedProduct.name,
                    enable: retrievedProduct.active,
                    description: retrievedProduct.description,
                    defaultPrice: retrievedProduct.default_price,
                    updated: retrievedProduct.updated,
                    tier: retrievedProduct.metadata.tier || ""
                }
            },
        );

        if (!result.acknowledged) {
            console.error("Update operation not acknowledged");
            throw new InternalServerErrorException();
        }

        if (result.matchedCount === 0) {
            const stripeUpdateTimeStamp = this.subscriptionTypes.findOne(
                { stripeProductId: productStripe.id },
                { updated: 1 }
            );

            if (!stripeUpdateTimeStamp) {
                console.error("Update operation might have come out-of-order");
                throw new InternalServerErrorException();
            }
        }
    }

    async disableProduct (eventStripe: Stripe.ProductDeletedEvent) {

        const stripeProductObject: Stripe.Product = eventStripe.data.object;
        const stripeProductId: string = stripeProductObject.id;

        const result: UpdateWriteOpResult = await this.subscriptionTypes.updateOne(
            { stripeProductId: stripeProductId },
            { $set: { enable: false } }
        );

        if (!result.acknowledged) {
            console.error("Failed to disable product");
            throw new InternalServerErrorException();
        }
    }
}