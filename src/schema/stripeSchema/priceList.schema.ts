
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PriceList {
  @Prop({ type: Number, required: true })
  price: number; // in cents

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: String, required: true })
  priceId: string; // stripe price ID

  @Prop({ type: String, default: "" })
  description: string;

  @Prop({ type: Boolean, default: true })
  enable: boolean;

  @Prop({ type: String })
  billingScheme: string;

  @Prop({ type: String })
  billingInterval: string; // month, year, etc

  @Prop({ type: String })
  title: string;

  @Prop({ type: Number, default: -1 })
  updated: number; // Update timestamp
}

export const PriceListSchema = SchemaFactory.createForClass(PriceList);