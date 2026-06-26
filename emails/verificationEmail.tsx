// email templates// VerificationEmail.tsx
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Helvetica"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Helvetica',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>Your verification code is here</Preview>
      <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Row>
          <Heading as="h1">Hello, {username} 👋</Heading>
        </Row>
        <Row>
          <Text>Your verification code is:</Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{otp}</Text>
        </Row>
        <Row>
          <Text>If you didn't request this, you can safely ignore it.</Text>
        </Row>
        <Row>
          <Button
            href="#"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '20px',
            }}
          >
            Verify Now
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
