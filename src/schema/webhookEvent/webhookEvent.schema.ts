import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class WebhookEvent {
    @Prop({ required: true })
    eventId: string;

    @Prop({ required: false, type: String })
    idempotencyKey?: string | null;

    @Prop({ required: false, type: String })
    requestId?: string | null;

    @Prop({ required: true })
    eventOp: string;

    @Prop({})
    createdAt?: Date;

    @Prop({})
    processed: boolean;
}

export const WebhookEventSchema = SchemaFactory.createForClass(WebhookEvent);

WebhookEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });