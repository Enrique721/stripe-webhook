import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubscriptionDocument = HydratedDocument<SubscriptionClass>;

// startDate => Data de começo da assinatura principal da conta
// endDate => Data de termino da assinatura principal da conta

// Questoes relacionadas a cobranca dos add-ons vão ser cuidados pelo stripe
// O ciclo de cobrança serão sincronizados pela stripe
@Schema()
export class SubscriptionClass {
    @Prop({ type: String })
    stripeSubscriptionId: string;

    @Prop({ type: String })
    stripeClientId: string;

    @Prop({ type: String })
    status: string;

    @Prop({ type: [String], default: [] })
    allowedAction: string[];

    @Prop({ type: Date })
    startDate: Date;

    @Prop({ type: Date })
    endDate: Date;

    @Prop({
        type: [
            {
                title: { type: String, required: true },
                stripeItemId: { type: String, required: true },
                stripePriceId: { type: String, required: true },
                stripeProductId: { type: String, require: true },
                quantity: { type: Number, default: 1 },
                isAddon: { type: Boolean, default: false },
                enable: { type: Boolean, default: true }
            },
        ],
        default: [],
    })
    items: {
        title: string;
        stripeItemId: string;
        stripePriceId: string;
        stripeProductId: string;
        quantity: number;
        isAddon: boolean;
        enable: true;
    }[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionClass);