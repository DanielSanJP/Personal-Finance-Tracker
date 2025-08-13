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

export const exportToCSV = (
  data: ExportableData[],
  filename: string,
  headers?: string[]
) => {
  if (data.length === 0) {
    toast.error("No data to export");
    return;
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Format data for CSV
  const csvContent = [
    csvHeaders.join(","),
    ...data.map((row) =>
      csvHeaders
        .map((header) => {
          const value = row[header];
          // Handle dates properly by formatting them
          if (value instanceof Date) {
            return value.toISOString().split("T")[0];
          }
          // Handle numbers (don't quote them)
          if (typeof value === "number") {
            return value.toString();
          }
          // Handle strings with commas or quotes
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          // Handle other values
          return value?.toString() || "";
        })
        .join(",")
    ),
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  toast.success(`Exported ${data.length} records to CSV`);
};

// Specific function for transactions
export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    toast.error("No transactions to export");
    return;
  }

  // Simple date formatter: YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const headers = ["Description", "Category", "Date", "Amount", "Type", "Merchant"];
  
  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) => [
      `"${transaction.description.replace(/"/g, '""')}"`,
      `"${transaction.category.replace(/"/g, '""')}"`,
      `"${formatDate(transaction.date)}"`,
      transaction.amount.toFixed(2),
      `"${transaction.type}"`,
      `"${(transaction.merchant || "").replace(/"/g, '""')}"`
    ].join(","))
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  toast.success(`Exported ${transactions.length} transactions to CSV`);
};
