import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from "sonner";

export interface ExportableData {
  [key: string]: string | number | boolean | Date | null | undefined;
}

export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: string;
  merchant?: string;
}

export const exportToPDF = (
  data: ExportableData[],
  filename: string,
  title: string,
  headers: string[]
) => {
  if (data.length === 0) {
    toast.error("No data to export");
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Add export date and count
  doc.setFontSize(10);
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 32);
  doc.text(`Total Records: ${data.length}`, 14, 38);

  // Prepare table data
  const tableData = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return value?.toString() || '';
    })
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [71, 85, 105], // slate-600
      textColor: 255,
    },
    margin: { left: 14, right: 14 },
  });

  // Save the PDF
  doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  
  toast.success(`Exported ${data.length} records to PDF`);
};

// Specific function for transactions
export const exportTransactionsToPDF = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    toast.error("No transactions to export");
    return;
  }

  // Simple date formatter: YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Transaction History', 14, 22);
  
  // Add export date and count
  doc.setFontSize(10);
  doc.text(`Export Date: ${new Date().toLocaleDateString('en-GB')}`, 14, 32);
  doc.text(`Total Records: ${transactions.length}`, 14, 38);

  // Prepare table data
  const tableData = transactions.map(transaction => [
    transaction.description,
    transaction.category,
    formatDate(transaction.date),
    `$${transaction.amount.toFixed(2)}`,
    transaction.type,
    transaction.merchant || '',
  ]);

  const headers = ['Description', 'Category', 'Date', 'Amount', 'Type', 'Merchant'];

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [71, 85, 105], // slate-600
      textColor: 255,
    },
    margin: { left: 14, right: 14 },
  });

  // Save the PDF
  doc.save(`transactions-${new Date().toISOString().split('T')[0]}.pdf`);
  
  toast.success(`Exported ${transactions.length} transactions to PDF`);
};
