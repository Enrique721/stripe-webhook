import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { Invoice } from "src/schema/stripeSchema/Invoice.schema";
import { Injectable } from "@nestjs/common";
import { stripeInstance } from "src/stripe.instance";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class InvoiceStrategy implements IStrategy {

    constructor(

        @InjectModel("invoices", "Dash")
        private readonly invoiceModel: Model<Invoice>,
        private readonly stripeInstanceService: stripeInstance,
    ) {}

    parseObject(eventStripe: Stripe.Event) {

        const invoiceObject: Invoice = {
            stripeClientId: "",
            stripeSubscriptionId: "",
            stripeEventId: "",
            stripeProductId: "",
            stripeEventAction: "",
            lastFourDigits: "",
            invoicePdfUrl: "",
            invoiceUrl: "",
            stripeStatus: "",
            stripeEventType: "",
        }

        return invoiceObject;
    }

    async doOperation(eventStripe: Stripe.Event) {

        switch (eventStripe.type) {
            case "invoice.created":
                return await this.invoiceCreation(eventStripe);
            case "invoice.finalized":
                return await this.invoiceFinalized(eventStripe);
            case "invoice.payment_succeeded":
                return await this.invoicePaymentSucceeded(eventStripe);
            case "invoice.payment_failed":
                return await this.invoicePaymentFailed(eventStripe);
            case "invoice.payment_action_required":
                return await this.invoicePaymentActionRequired(eventStripe);
        }
    }

    async invoiceCreation(stripeEvent: Stripe.InvoiceCreatedEvent) {

        const stripeInvoiceObject: Stripe.Invoice = stripeEvent.data.object;
        const invoiceId: string = stripeInvoiceObject.id

        await this.invoiceModel.updateOne(
            { stripeInvoiceId: invoiceId },
            {
                $setOnInsert: {
                },
                $set: {
                }
            },
            { upsert: true }
        );
    }

    async invoiceFinalized(stripeEvent: Stripe.InvoiceFinalizedEvent) {

        const stripeInvoiceObject: Stripe.Invoice = stripeEvent.data.object;
    }

    async invoicePaymentSucceeded(stripeEvent: Stripe.InvoicePaymentSucceededEvent) {

        const stripeInvoiceObject: Stripe.Invoice = stripeEvent.data.object;
    }

    async invoicePaymentFailed(stripeEvent: Stripe.InvoicePaymentFailedEvent) {

        const stripeInvoiceObject: Stripe.Invoice = stripeEvent.data.object;
    }

    async invoicePaymentActionRequired(stripeEvent: Stripe.InvoicePaymentActionRequiredEvent) {

        const stripeInvoiceObject: Stripe.Invoice = stripeEvent.data.object;
    }
}