import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {

  @Prop({ type: String, required: true })
  stripeInvoiceId: string;

  @Prop({ type: String })
  stripeClientId: string;

  @Prop({ type: String })
  stripeSubscriptionId?: string;

  @Prop({ type: String })
  stripeInvoicePdfUrl?: string;

  @Prop({ type: String })
  stripeHostedInvoiceUrl?: string;

  @Prop({ type: String })
  stripeInvoiceStatus?: string;

  @Prop({ type: String })
  billingReason?: string;

  @Prop({ type: String })
  stripeCurrency?: string;

  @Prop({ type: Number })
  amountDue?: number;

  @Prop({ type: Number })
  amountPaid?: number;

  @Prop({ type: Number })
  amountRemaining?: number;

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);