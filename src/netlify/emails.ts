import type { QuoteDocument } from '~/netlify/firestore';
import { resolveQuoteRequesterInfo } from '~/netlify/firestore';

import type { Nullable } from '~/types';
import { formatCurrency } from '~/shared';
import { SITE_DOMAIN } from '~/netlify/constants';
import { sendEmail } from '~/netlify/utils';

type QuotePricedEmailParams = {
  quoteNumber: string;
  firstName: string;
  lastName: string;
  amount: string;
  discount: string | undefined;
  vat: string | undefined;
  total: string;
  quoteUrl: string;
  note: string | undefined;
};

interface SendQuotePricedEmailOptions {
  amount: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  note: Nullable<string>;
}

export const sendQuotePricedEmail = async (
  quote: QuoteDocument,
  { amount, discountAmount, vatAmount, total, note }: SendQuotePricedEmailOptions,
) => {
  const quoteRequester = await resolveQuoteRequesterInfo(quote);

  if (quoteRequester) {
    await sendEmail<QuotePricedEmailParams>('quote-priced', {
      to: quoteRequester.email,
      subject: `Your quote #${quote.quoteNumber} is ready`,
      parameters: {
        quoteNumber: quote.quoteNumber,
        firstName: quoteRequester.firstName,
        lastName: quoteRequester.lastName,
        amount: formatCurrency(amount),
        discount: discountAmount ? formatCurrency(discountAmount) : undefined,
        vat: vatAmount ? formatCurrency(vatAmount) : undefined,
        total: formatCurrency(total),
        quoteUrl: `${SITE_DOMAIN}/account/quotes`,
        note: note ?? undefined,
      },
    });
  }
};
