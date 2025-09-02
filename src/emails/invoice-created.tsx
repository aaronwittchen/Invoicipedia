import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { formatCurrency, type Currency } from '@/lib/currency';

interface InvoiceCreatedEmailProps {
  invoiceId: number;
  amount: number;
  currency: Currency;
  description: string;
  customerName: string;
  dueDate?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:5000';

export const InvoiceCreatedEmail = ({
  invoiceId,
  amount,
  currency,
  description,
  customerName,
  dueDate,
}: InvoiceCreatedEmailProps) => (
  <Html>
    <Head />
    <Preview>{`New Invoice #${invoiceId} - ${formatCurrency(amount, currency)}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Invoice #{invoiceId}</Heading>
        <Text style={paragraph}>
          Hello {customerName}, you have a new invoice due for{' '}
          {formatCurrency(amount, currency)}.
        </Text>
        <Text style={paragraph}>
          <strong>Description:</strong> {description}
        </Text>
        {dueDate && (
          <Text style={paragraph}>
            <strong>Due Date:</strong> {dueDate}
          </Text>
        )}
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${baseUrl}/invoices/${invoiceId}/payments`}
          >
            Pay Invoice
          </Button>
        </Section>
        <Hr style={hr} />
        <Link href={`${baseUrl}/invoices/${invoiceId}`} style={reportLink}>
          View Invoice Details
        </Link>
      </Container>
    </Body>
  </Html>
);

InvoiceCreatedEmail.PreviewProps = {
  invoiceId: 1234,
  amount: 5000, // $50.00 in cents
  currency: 'usd' as Currency,
  description: 'Web development services for Q1 2024',
  customerName: 'John Doe',
  dueDate: '2024-03-31',
} as InvoiceCreatedEmailProps;

export default InvoiceCreatedEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#5e6ad2',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};
