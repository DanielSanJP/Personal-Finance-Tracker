import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";
import { Card, CardContent } from "@/components/ui/card";

export default function ReceiptScanningPage() {
  return (
    <GuideLayout
      title="Receipt Scanning"
      description="Quickly add transactions by scanning receipts with your camera"
    >
      <div className="space-y-6">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Receipt scanning is one of the most convenient ways to add
          transactions to your Personal Finance Tracker. Simply take a photo of
          your receipt, and our AI will automatically extract all the relevant
          information.
        </p>

        {/* Getting Started */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Scanning a Receipt
          </h2>

          <GuideStep
            stepNumber={1}
            title="Access Receipt Scanner"
            image="/guides/smart-input/scannerbuttons.png"
          >
            <p>There are multiple ways to access the receipt scanner:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                Click <strong>&quot;Scan Receipt&quot;</strong> from the
                dashboard quick actions
              </li>
              <li>
                Click the <strong>camera icon</strong> on the transaction form
              </li>
              <li>Navigate to Transactions → Add → Scan Receipt</li>
            </ul>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Choose Input Method"
            image="/guides/smart-input/receiptscanner.png"
          >
            <p>You have two options for providing your receipt:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>
                <strong>Take Photo</strong> - Use your device&apos;s camera to
                capture the receipt in real-time
              </li>
              <li>
                <strong>Upload Image</strong> - Select an existing photo from
                your device&apos;s gallery
              </li>
            </ul>
          </GuideStep>

          <GuideStep
            stepNumber={3}
            title="Position Your Receipt"
            tip="Hold your phone parallel to the receipt for the best results. The entire receipt should be visible within the frame."
          >
            <p>If taking a photo, position your camera so that:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>The entire receipt is visible</li>
              <li>The receipt is centered in the frame</li>
              <li>There&apos;s good lighting (no shadows or glare)</li>
              <li>The receipt is flat (not crumpled or folded)</li>
            </ul>
          </GuideStep>

          <GuideStep stepNumber={4} title="Capture the Image">
            <p>
              Once your receipt is properly positioned, tap the capture button
              to take the photo. You&apos;ll see a preview of the image you
              captured.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={5}
            title="Confirm or Retake"
            warning="If the image is blurry, dark, or partially cut off, retake the photo for better results."
          >
            <p>
              Review the captured image. If it looks good, tap{" "}
              <strong>&quot;Use This Photo&quot;</strong>. If not, tap{" "}
              <strong>&quot;Retake&quot;</strong> to capture a new image.
            </p>
          </GuideStep>

          <GuideStep stepNumber={6} title="Wait for AI Processing">
            <p>
              The AI will now analyze your receipt. This typically takes 3-5
              seconds. During this time, it&apos;s extracting:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Total amount</li>
              <li>Merchant/store name</li>
              <li>Transaction date and time</li>
              <li>Individual line items (if applicable)</li>
              <li>Payment method (if shown)</li>
            </ul>
          </GuideStep>

          <GuideStep
            stepNumber={7}
            title="Review Extracted Data"
            tip="The AI is smart but not perfect. Always double-check the amount and merchant name before saving."
          >
            <p>
              The transaction form will be automatically populated with the
              extracted information. Review each field:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>
                <strong>Amount</strong> - Verify this matches the receipt total
              </li>
              <li>
                <strong>Merchant</strong> - Check if the business name was
                detected correctly
              </li>
              <li>
                <strong>Date</strong> - Confirm the transaction date is accurate
              </li>
              <li>
                <strong>Category</strong> - The AI will suggest a category based
                on the merchant, but you can change it
              </li>
            </ul>
          </GuideStep>

          <GuideStep stepNumber={8} title="Add Missing Information">
            <p>Fill in any fields that weren&apos;t automatically detected:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                Select the <strong>account</strong> you used for this purchase
              </li>
              <li>
                Adjust the <strong>category</strong> if the suggested one
                isn&apos;t right
              </li>
              <li>
                Add a <strong>description</strong> if you want more details
              </li>
            </ul>
          </GuideStep>

          <GuideStep stepNumber={9} title="Save Transaction">
            <p>
              Once everything looks correct, click{" "}
              <strong>&quot;Add Transaction&quot;</strong>. Your transaction
              will be saved and added to your transaction history.
            </p>
          </GuideStep>
        </div>

        {/* Best Practices */}
        <div className="pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Best Practices
          </h2>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm text-green-900">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Scan immediately:</strong> Capture receipts right
                    after your purchase while they&apos;re still fresh
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Good lighting:</strong> Natural daylight works best
                    for clear images
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Flat surface:</strong> Place receipts on a flat
                    surface for easier scanning
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Review before saving:</strong> Always verify
                    extracted data before saving
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Keep digital copies:</strong> You can discard
                    physical receipts once scanned and saved
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </GuideLayout>
  );
}
