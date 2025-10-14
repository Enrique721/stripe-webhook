import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventMainClassType, StrategyStorage } from './strategy/strategyStorage';
import { IStrategy } from './strategy/strategy.interface';
import Stripe from 'stripe';

@Injectable()
export class AppService implements OnModuleInit{

  private stripe: Stripe;

  constructor(
    private readonly strategyStorage: StrategyStorage,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    try {
      const privateKey = this.configService.get<string>("stripe.privateKey");

      if (!privateKey)
        throw new Error("Require private stripe key");

      this.stripe = new Stripe(privateKey, { apiVersion: "2025-09-30.clover" });
    } catch (e) {
      console.error(e.message);
    }
  }


  async handler(eventStripe: Stripe.Event) {
    const [mainClass, ..._subClass] = eventStripe.type.split(".");
    const strategy: IStrategy = this.strategyStorage.getStrategy(mainClass as EventMainClassType);

    const parsedObject: any = strategy.parseObject(eventStripe);
    strategy.doOperation(parsedObject);
  }

  getStripeInstance(): Stripe {
    return this.stripe;
  }
}