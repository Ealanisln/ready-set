// src/components/Logistics/QuoteRequest/ClientFormWrapper.tsx
"use client";

import React from 'react';
import { FormManager } from "./Quotes/FormManager";
import { FormType } from "./types";

interface WrapperProps {
  children: React.ReactElement<{ onRequestQuote?: (formType: FormType) => void }> | React.ReactElement<{ onRequestQuote?: (formType: FormType) => void }>[];
}

export const ClientFormWrapper: React.FC<WrapperProps> = ({ children }) => {
  const { openForm, closeForm, DialogForm } = FormManager();

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Pasar la prop onRequestQuote a todos los elementos hijos
      return React.cloneElement(child, {
        ...(typeof child.props === 'object' ? child.props : {}),
        onRequestQuote: (formType: FormType) => {
          console.log('ClientFormWrapper - onRequestQuote called with:', formType);
          openForm(formType);
        }
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      {DialogForm}
    </>
  );
};