import React from 'react';
import { DocumentProps, pdf } from '@react-pdf/renderer';
import { consoleError } from '@/lib/clientLog';

export const downloadPdf = async (reportElement: React.ReactElement<DocumentProps>, fileName: string) => {
  try {
    const blob = await pdf(reportElement).toBlob();
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    consoleError('Error generating PDF:', error);
    throw error;
  }
};