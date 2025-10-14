import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductSubscriptionDocument = HydratedDocument<ProductSubscription>;

@Schema()
export class ProductSubscription {

    @Prop({ type: String })
    stripePriceId: string;

    @Prop({ type: Number })
    price: number; // In cents

    @Prop({ type: String })
    title: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String })
    duration: string;

    @Prop({ type: [String]})
    allowed_action: string[];

    @Prop({ type: Boolean })
    enable: boolean;
}

export const ProductSubscriptionSchema = SchemaFactory.createForClass(ProductSubscription);