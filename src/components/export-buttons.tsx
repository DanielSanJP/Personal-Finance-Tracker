import { Button } from "@/components/ui/button";
import {
  exportTransactionsToCSV,
  ExportableData,
} from "@/lib/export/csv-export";
import { exportTransactionsToPDF } from "@/lib/export/pdf-export";

interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: string;
  merchant?: string;
}

interface ExportButtonsProps {
  data: Transaction[] | ExportableData[];
  type?: "transactions" | "custom";
  className?: string;
  filename?: string;
  title?: string;
  headers?: string[];
}

export function ExportButtons({
  data,
  type = "custom",
  className = "",
  filename = "export",
  title = "Data Export",
  headers,
}: ExportButtonsProps) {
  const handleCSVExport = () => {
    if (type === "transactions") {
      exportTransactionsToCSV(data as Transaction[]);
    } else {
      // For custom data types - we'll create a simple CSV export for now
      if (data.length === 0) return;

      const csvHeaders = headers || Object.keys(data[0]);
      const csvContent = [
        csvHeaders.join(","),
        ...data.map((row: ExportableData | Transaction) =>
          csvHeaders
            .map((header) => {
              const value = (row as Record<string, unknown>)[header];
              if (typeof value === "string") {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value?.toString() || "";
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  };

  const handlePDFExport = () => {
    if (type === "transactions") {
      exportTransactionsToPDF(data as Transaction[]);
    } else {
      // For custom data types - we'll import jsPDF here for simplicity
      import("jspdf").then(async ({ default: jsPDF }) => {
        const autoTable = await import("jspdf-autotable");

        if (data.length === 0) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(title!, 14, 22);

        doc.setFontSize(10);
        doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 32);
        doc.text(`Total Records: ${data.length}`, 14, 38);

        const csvHeaders = headers || Object.keys(data[0]);
        const tableData = data.map((row: ExportableData | Transaction) =>
          csvHeaders.map(
            (header) =>
              (row as Record<string, unknown>)[header]?.toString() || ""
          )
        );

        autoTable.default(doc, {
          head: [csvHeaders],
          body: tableData,
          startY: 45,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [71, 85, 105], textColor: 255 },
          margin: { left: 14, right: 14 },
        });

        doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
      });
    }
  };

  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      <Button variant="outline" className="w-40" onClick={handleCSVExport}>
        Export to CSV
      </Button>
      <Button variant="outline" className="w-40" onClick={handlePDFExport}>
        Export to PDF
      </Button>
    </div>
  );
}
