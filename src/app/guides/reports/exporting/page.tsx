import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function ExportingReportsGuide() {
  return (
    <GuideLayout
      title="Exporting Reports"
      description="Learn how to export your transaction data to CSV and PDF formats"
    >
      <GuideStep
        stepNumber={1}
        title="Export Location"
        image="/guides/transactions/transquickbuttons.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Export functionality is available on the{" "}
          <strong className="text-foreground">Transactions</strong> page (not
          Reports page). Look for the{" "}
          <strong className="text-foreground">Quick Actions</strong> card with
          two export buttons:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Export to CSV</li>
          <li>Export to PDF</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Export to CSV">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To export transactions as a CSV spreadsheet:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Go to the <strong className="text-foreground">Transactions</strong>{" "}
            page
          </li>
          <li>Apply any filters if needed (optional)</li>
          <li>
            Click <strong className="text-foreground">Export to CSV</strong>
          </li>
          <li>File downloads automatically as transactions-[date].csv</li>
        </ol>
        <p className="text-sm text-muted-foreground mt-3">
          Opens in Excel, Google Sheets, Numbers, or any spreadsheet software
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Export to PDF">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To export transactions as a PDF document:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Go to the <strong className="text-foreground">Transactions</strong>{" "}
            page
          </li>
          <li>Apply any filters if needed (optional)</li>
          <li>
            Click <strong className="text-foreground">Export to PDF</strong>
          </li>
          <li>File downloads automatically as transactions-[date].pdf</li>
        </ol>
        <p className="text-sm text-muted-foreground mt-3">
          PDF includes formatted table with title, export date, and transaction
          count
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="What Gets Exported">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Both CSV and PDF exports include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Date:</strong> When transaction
            occurred
          </li>
          <li>
            <strong className="text-foreground">Description:</strong> Merchant
            name
          </li>
          <li>
            <strong className="text-foreground">Category:</strong> Assigned
            category
          </li>
          <li>
            <strong className="text-foreground">Amount:</strong> Dollar amount
          </li>
          <li>
            <strong className="text-foreground">Account:</strong> Account name
          </li>
          <li>
            <strong className="text-foreground">Type:</strong> Income or Expense
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Exports respect your current filters - only visible transactions are
          exported
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="CSV vs PDF">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Choose the format based on your needs:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-foreground mb-1">CSV Format</h4>
            <p className="text-sm text-muted-foreground">
              Best for data analysis, importing to other software, tax
              preparation. Can be edited in spreadsheets.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-foreground mb-1">PDF Format</h4>
            <p className="text-sm text-muted-foreground">
              Best for printing, sharing, archiving. Professional formatting,
              opens on any device.
            </p>
          </div>
        </div>
      </GuideStep>
    </GuideLayout>
  );
}
