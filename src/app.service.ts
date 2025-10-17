import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventMainClassType, StrategyStorage } from './strategy/strategyStorage';
import { IStrategy } from './strategy/strategy.interface';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { WebhookEvent } from './schema/webhookEvent/webhookEvent.schema';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @InjectModel("webhookevents", "Dash")
    private readonly webhookModel: Model<WebhookEvent>,
    private readonly strategyStorage: StrategyStorage,
  ) {}


  async handler(eventStripe: Stripe.Event) {
    const [mainClass, ..._subClass] = eventStripe.type.split(".");
    console.log(mainClass);
    console.log(eventStripe.type);
    try {

      const event = await this.createEventLog(eventStripe)
      if (!event)
        return;

      const strategy: IStrategy | null = this.strategyStorage.getStrategy(mainClass as EventMainClassType);
      if (!strategy)
        return;

      strategy.doOperation(eventStripe);

      event.processed = true;
      await event.save();
    } catch (e) {
      throw new InternalServerErrorException("Event not properly treated");
    }
  }

  private async createEventLog(eventStripe: Stripe.Event) {
    const status = await this.webhookModel.findOne({eventId: eventStripe.id, processed: true});

    if (status)
      return;

    try {
      const eventIdempondencyObject = this.createWebhookIdempondencyObject(eventStripe);
      return await this.webhookModel.create(eventIdempondencyObject);
    } catch (e) {
      console.error("Failed to save stripe event");
    }

  }

  private createWebhookIdempondencyObject(event: Stripe.Event): WebhookEvent {

    return {
      eventId: event.id,
      eventOp: event.type,
      idempotencyKey: event.request?.idempotency_key,
      requestId: event.request?.id,
      processed: false
    }
  }
}