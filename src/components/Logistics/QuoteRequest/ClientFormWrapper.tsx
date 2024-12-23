// src/components/Logistics/QuoteRequest/ClientFormWrapper.tsx
"use client";

import React from 'react';
import { FormManager } from "./Quotes/FormManager";
import { FormType } from "./types";

interface WrapperProps {
  children: React.ReactNode;
}

export const ClientFormWrapper: React.FC<WrapperProps> = ({ children }) => {
  const { openForm, closeForm, DialogForm } = FormManager();

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      // Create a new props object explicitly
      const newProps = {
        ...child.props as object, // Cast to object to ensure spread works
        onRequestQuote: (formType: FormType) => {
          console.log('ClientFormWrapper - onRequestQuote called with:', formType);
          openForm(formType);
        }
      };
      
      return React.cloneElement(child, newProps);
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