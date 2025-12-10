import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createGlobalStyle, css, HoneyStyleProvider } from '@react-hive/honey-style';

import { theme } from '~/theme';

const root = createRoot(document.getElementById('root') as HTMLDivElement);

const GlobalStyle = createGlobalStyle`${() => css`
  body {
    margin: 0;
    padding: 0;
    background: #f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  }

  .container {
    max-width: 620px;
    margin: 32px auto;
    background: #ffffff;
    padding: 28px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }

  h1 {
    font-size: 22px;
    margin: 0 0 18px;
    color: #111827;
    font-weight: 600;
  }

  .meta {
    margin-bottom: 24px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
  }

  .label {
    font-weight: bold;
    color: #111827;
  }

  .description {
    line-height: 1.6;
    white-space: pre-line;
    font-size: 15px;
    color: #374151;
    margin-bottom: 28px;
  }

  .copies {
    font-size: 15px;
    color: #374151;
    margin-bottom: 18px;
  }

  .quote-box {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 18px;
    margin-bottom: 28px;
    font-size: 15px;
    color: #374151;
  }

  .button {
    display: inline-block;
    padding: 12px 18px;
    background-color: #2563eb;
    color: #ffffff !important;
    text-decoration: none;
    font-size: 15px;
    border-radius: 6px;
    margin-top: 8px;
  }

  .footer {
    font-size: 12px;
    color: #6b7280;
    margin-top: 40px;
    text-align: center;
  }
`}`;

interface TemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  copies: string;
  estimatedQuoteTotal: string;
  downloadModelUrl: string;
}

const Template = ({
  firstName,
  lastName,
  email,
  description,
  copies,
  estimatedQuoteTotal,
  downloadModelUrl,
}: TemplateProps) => {
  return (
    <div className="container">
      <h1>New Quote Request</h1>

      <div className="meta">
        <div>
          <span className="label">From:</span> {firstName} {lastName}
        </div>
        <div>
          <span className="label">Email:</span> {email}
        </div>
      </div>

      <div className="description">{description}</div>

      <div className="copies">Copies: {copies}</div>

      <div className="quote-box">
        <span className="label">Estimated Quote:</span> £{estimatedQuoteTotal}
      </div>

      <a className="button" href={downloadModelUrl} target="_blank" rel="noreferrer">
        Download Model File
      </a>
    </div>
  );
};

const App = () => {
  return (
    <>
      <GlobalStyle />

      <Template
        firstName="{{firstName}}"
        lastName="{{lastName}}"
        email="{{email}}"
        description="{{description}}"
        copies="{{copies}}"
        estimatedQuoteTotal="{{estimatedQuoteTotal}}"
        downloadModelUrl="{{downloadModelUrl}}"
      />
    </>
  );
};

root.render(
  <HoneyStyleProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </HoneyStyleProvider>,
);
