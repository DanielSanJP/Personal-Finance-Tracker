import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";
import { Card, CardContent } from "@/components/ui/card";

export default function VoiceInputPage() {
  return (
    <GuideLayout
      title="Voice Input for Transactions"
      description="Add transactions hands-free using voice commands"
    >
      <div className="space-y-6">
        {/* Introduction */}
        <p className="text-foreground leading-relaxed">
          Voice input is a powerful feature that allows you to add transactions
          without typing. Simply speak naturally about your transaction, and our
          AI will automatically extract the amount, description, merchant, and
          category.
        </p>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm text-foreground">
              <strong>ðŸ’¡ Works Best When:</strong> You speak clearly and include
              key information like the amount, what you bought, and where. For
              example: &quot;Fifty dollars for dinner at Olive Garden&quot;
            </p>
          </CardContent>
        </Card>

        {/* Using Voice Input */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Using Voice Input
          </h2>

          <GuideStep
            stepNumber={1}
            title="Open the Transaction Form"
            image="/guides/smart-input/scannerbuttons.png"
          >
            <p>
              Navigate to add a new transaction (expense or income). You&apos;ll
              see a<strong> microphone icon</strong> near the top of the form.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Click the Microphone Icon"
            image="/guides/smart-input/expensevoice.png"
            tip="Make sure you allow microphone access when your browser prompts you the first time."
          >
            <p>
              Click the microphone icon to activate voice input. A modal will
              appear asking for microphone permissions if this is your first
              time.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={3}
            title="Grant Microphone Permission"
            warning="If you accidentally deny permission, you'll need to enable it in your browser settings."
          >
            <p>
              When prompted by your browser, click{" "}
              <strong>&quot;Allow&quot;</strong> to grant microphone access.
              This permission is only used for voice input and your data stays
              private.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={4}
            title="Start Speaking"
            image="/guides/smart-input/voicerecord.png"
          >
            <p>
              Once the microphone is active, speak your transaction naturally.
              Include:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Amount</strong> - &quot;Twenty-five dollars&quot; or
                &quot;$25&quot;
              </li>
              <li>
                <strong>Description</strong> - What you bought
              </li>
              <li>
                <strong>Merchant</strong> (optional) - Where you bought it
              </li>
              <li>
                <strong>Category</strong> (optional) - Type of expense
              </li>
            </ul>
          </GuideStep>

          <GuideStep
            stepNumber={5}
            title="Stop Recording"
            tip="The recording automatically stops when you finish speaking, or you can click the 'Stop Recording' button."
          >
            <p>
              When you&apos;re done speaking, click{" "}
              <strong>&quot;Stop Recording&quot;</strong> or wait for the
              automatic stop. The system will immediately begin processing your
              voice input.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={6}
            title="AI Processing"
            image="/guides/smart-input/voiceresult.png"
          >
            <p>
              The AI automatically processes your speech in real-time.
              You&apos;ll see a &quot;Processing...&quot; status while it:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Transcribes your speech to text</li>
              <li>Extracts the transaction amount</li>
              <li>Identifies merchant and description</li>
              <li>Suggests an appropriate category</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              This typically takes 2-3 seconds.
            </p>
          </GuideStep>

          <GuideStep
            stepNumber={7}
            title="Review Auto-Filled Form"
            image="/guides/smart-input/voicereview.png"
          >
            <p>
              The form will be automatically filled with the extracted
              information:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Amount field will show the monetary value</li>
              <li>Description will contain what you said you bought</li>
              <li>Merchant will be filled if you mentioned a store</li>
              <li>Category will be suggested based on context</li>
            </ul>
          </GuideStep>

          <GuideStep stepNumber={8} title="Make Any Adjustments">
            <p>
              Review all the auto-filled fields and make corrections if needed.
              The AI is smart but not perfect, so always double-check:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Amount is correct</li>
              <li>Category makes sense</li>
              <li>Account is selected</li>
              <li>Date is accurate</li>
            </ul>
          </GuideStep>

          <GuideStep stepNumber={9} title="Save the Transaction">
            <p>
              Once everything looks good, click{" "}
              <strong>&quot;Save&quot;</strong> to save it to your account.
            </p>
          </GuideStep>
        </div>

        {/* Tips & Examples */}
        <div className="pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Tips & Examples
          </h2>

          <Card className="bg-green-50 border-green-200 mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm text-green-900">
                <li className="flex gap-2">
                  <span>âœ“</span>
                  <span>
                    <strong>Start with the amount:</strong> &quot;Forty-five
                    dollars for groceries at Whole Foods&quot;
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>âœ“</span>
                  <span>
                    <strong>Include the merchant:</strong> Helps with automatic
                    categorization
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>âœ“</span>
                  <span>
                    <strong>Speak clearly:</strong> Find a quiet place and use a
                    normal pace
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>âœ“</span>
                  <span>
                    <strong>Use natural language:</strong> Say &quot;fifteen
                    bucks&quot; or &quot;$15&quot; - both work
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-green-700">
                  âœ… Good Examples
                </h3>
                <ul className="space-y-3 text-sm text-foreground">
                  <li>
                    <strong>
                      &quot;$45.50 for groceries at Whole Foods&quot;
                    </strong>
                  </li>
                  <li>
                    <strong>&quot;Twenty dollars for gas at Shell&quot;</strong>
                  </li>
                  <li>
                    <strong>&quot;Fifteen bucks at Starbucks&quot;</strong>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-amber-600">âš ï¸ Avoid</h3>
                <ul className="space-y-3 text-sm text-foreground">
                  <li>
                    âŒ <strong>&quot;I spent some money on stuff&quot;</strong>
                    <br />
                    <span className="text-xs">Too vague - no amount!</span>
                  </li>
                  <li>
                    âŒ{" "}
                    <strong>
                      &quot;Bought a thing at the place yesterday&quot;
                    </strong>
                    <br />
                    <span className="text-xs">Needs specific details</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
