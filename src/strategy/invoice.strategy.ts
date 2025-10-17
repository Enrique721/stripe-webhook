import Stripe from "stripe";
import { IStrategy } from "./strategy.interface";
import { Invoice } from "src/schema/stripeSchema/Invoice.schema";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { stripeInstance } from "src/stripe.instance";
import { Model, UpdateWriteOpResult } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class InvoiceStrategy implements IStrategy {

    constructor(

        @InjectModel("invoices", "Dash")
        private readonly invoiceModel: Model<Invoice>,
        private readonly stripeInstanceService: stripeInstance,
    ) {}

    async doOperation(eventStripe: Stripe.Event) {

        const stripeInvoiceObject: Stripe.Invoice = eventStripe.data.object as Stripe.Invoice;

        switch (eventStripe.type) {
            case "invoice.created":
            case "invoice.finalized":
            case "invoice.paid":
            case "invoice.payment_succeeded":
            case "invoice.payment_failed":
            case "invoice.payment_action_required":
                return await this.invoiceCreation(stripeInvoiceObject);
        }
    }

    async invoiceCreation(stripeInvoiceObject: Stripe.Invoice) {
        const invoiceId: string = stripeInvoiceObject.id
        const updateObject = {
            stripeClientId: stripeInvoiceObject.customer as string,
            stripeSubscriptionId: stripeInvoiceObject.parent?.subscription_details?.subscription as string || undefined,
            stripeInvoiceStatus: stripeInvoiceObject.status ?? undefined,
            stripeInvoicePdfUrl: stripeInvoiceObject.invoice_pdf ?? undefined,
            stripeHostedInvoiceUrl: stripeInvoiceObject.hosted_invoice_url ?? undefined,
            stripeCurrency: stripeInvoiceObject.currency,
            billingReason: stripeInvoiceObject.billing_reason ?? undefined,
            amountDue: stripeInvoiceObject.amount_due,
            amountPaid: stripeInvoiceObject.amount_paid,
            amountRemaining: stripeInvoiceObject.amount_remaining,
        }

        const result: UpdateWriteOpResult = await this.invoiceModel.updateOne(
            { stripeInvoiceId: invoiceId },
            {
                $setOnInsert: { stripeInvoiceId: stripeInvoiceObject.id },
                $set: updateObject 
            },
            { upsert: true }
        );

        if (!result.acknowledged) {
            console.error("The insertion/update was no acknowledged by the database");
            throw new InternalServerErrorException(); 
        }
    }
}