import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PriceList } from "./priceList.schema";

export type ProductSubscriptionDocument = HydratedDocument<ProductSubscription>;

@Schema()
export class ProductSubscription {

    @Prop({ type: String })
    stripeProductId: string;

    @Prop({ type: [PriceList] })
    priceList?: {
        price: number,
        currency: string,
        priceId: string,
        description: string,
        active: boolean,
        billingScheme: string,
        billingInterval: string,
    }[];

    @Prop({ type: String })
    title?: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: String })
    duration?: string;

    @Prop({ type: Boolean })
    enable?: boolean;

    @Prop({ type: String })
    tier?: string;

    @Prop({ type: Number, default: -1 })
    updated?: number;

    @Prop({ type: String })
    defaultPrice: string;
}

export const ProductSubscriptionSchema = SchemaFactory.createForClass(ProductSubscription);