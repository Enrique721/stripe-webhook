import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './schema/stripeSchema/Invoice.schema';
import { SubscriptionSchema } from './schema/stripeSchema/Subscription.schema';
import { ProductSubscriptionSchema } from './schema/stripeSchema/TypeOfSubscription.schema';
import { StrategyStorage } from './strategy/strategyStorage';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: "invoices", schema: InvoiceSchema },
      { name: "subscriptions", schema: SubscriptionSchema },
      { name: "subscriptiontypes", schema: ProductSubscriptionSchema }
    ], "Dash")
  ],
  controllers: [AppController],
  providers: [
    AppService,
    StrategyStorage
  ],
})
export class AppModule { }
