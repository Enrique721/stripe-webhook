import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './schema/stripeSchema/Invoice.schema';
import { SubscriptionSchema } from './schema/stripeSchema/Subscription.schema';
import { ProductSubscriptionSchema } from './schema/stripeSchema/TypeOfSubscription.schema';
import { StrategyStorage } from './strategy/strategyStorage';
import { WebhookEventSchema } from './schema/webhookEvent/webhookEvent.schema';
import { BillingStrategy } from './strategy/billing.strategy';
import { ProductStrategy } from './strategy/product.strategy';
import { CustomerStrategy } from './strategy/customer.strategy';
import { PriceStrategy } from './strategy/price.strategy';
import { InvoiceStrategy } from './strategy/invoice.strategy';
import { PaymentIntentStrategy } from './strategy/paymentIntent.strategy';
import { PaymentMethodStrategy } from './strategy/paymentMethod.strategy';
import { PlanStrategy } from './strategy/plan.strategy';
import { stripeInstance } from './stripe.instance';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: "invoices", schema: InvoiceSchema },
      { name: "subscriptions", schema: SubscriptionSchema },
      { name: "subscriptiontypes", schema: ProductSubscriptionSchema },
      { name: "webhookevents", schema: WebhookEventSchema }
    ], "Dash")
  ],
  controllers: [AppController],
  providers: [
    stripeInstance,
    StrategyStorage,
    BillingStrategy,
    ProductStrategy,
    CustomerStrategy,
    PriceStrategy,
    InvoiceStrategy,
    PaymentIntentStrategy,
    PaymentMethodStrategy,
    PlanStrategy,
    AppService,
  ],
})
export class AppModule { }
