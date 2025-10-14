import {
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';

import {
  AppService
} from './app.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';



@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  private checkSignature(
    rawBody: any,
    endpointSecret: string | undefined,
    signature: string
  ): Stripe.Event {

    if (!rawBody) {
      console.error("Stripe mal formatted event");
      throw new InternalServerErrorException("Missing body");
    }

    if (!endpointSecret) {
      console.error("Mssing endpoint secret aka missing webhook secret");
      throw new InternalServerErrorException();
    }

    try {
      const stripe = this.appService.getStripeInstance();
      return stripe.webhooks.constructEvent(rawBody,
                                            signature,
                                            endpointSecret);
    } catch (err) {
      console.error('❌ Signature verification failed:', err.message);
      throw err;
    }
  }

  @Post()
  async handleStripe(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string
  ) {
    const rawBody = req.body as any;
    const endpointSecret: string | undefined = this.configService.get<string>("webhook.secret");

    const event: Stripe.Event = this.checkSignature(rawBody, endpointSecret, signature);

    return this.appService.handler(event);
  }

}
