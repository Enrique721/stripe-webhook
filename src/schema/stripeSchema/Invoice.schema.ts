import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ type: String, required: true })
  stripeClientId: string;

  @Prop({ type: String, required: true })
  stripeSubscriptionId: string;

  @Prop({ type: String })
  stripeInvoiceId: string;

  @Prop({ type: String })
  stripeProductId: string;

  @Prop({ type: String })
  stripeEventType: string;

  @Prop({ type: String })
  stripeEventAction: string;

  @Prop({ type: String })
  lastFourDigits: string;

  @Prop({ type: String })
  invoicePdfUrl?: string;

  @Prop({ type: String })
  invoiceUrl?: string;

  @Prop({ type: String })
  stripeStatus: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);