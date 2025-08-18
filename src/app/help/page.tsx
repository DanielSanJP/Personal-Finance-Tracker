"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Nav from "@/components/nav";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  Phone,
  ExternalLink,
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Help & Support
            </CardTitle>
            <p className="text-muted-foreground">
              Get help with your Personal Finance Tracker experience.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-white">
                  <h4 className="font-medium mb-2">
                    How do I add a new account?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the Accounts page and click &quot;Add New
                    Account&quot;. Fill in your account details and click save.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <h4 className="font-medium mb-2">
                    How do I categorize transactions?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When adding transactions, you can select from predefined
                    categories or create custom ones to organize your spending.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <h4 className="font-medium mb-2">
                    Can I export my financial data?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Visit the Reports page where you can export your data
                    in CSV or PDF format for your records.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <h4 className="font-medium mb-2">How do I set up budgets?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to the Budgets page to create spending limits for
                    different categories and track your progress throughout the
                    month.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Email Support</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get help via email. We typically respond within 24 hours.
                  </p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    support@personalfinancetracker.com
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Phone Support</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Speak with our support team during business hours.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    1-800-PFT-HELP
                  </Button>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resources</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="font-medium">User Guide</span>
                  <span className="text-xs text-muted-foreground">
                    Complete documentation
                  </span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span className="font-medium">Community Forum</span>
                  <span className="text-xs text-muted-foreground">
                    Connect with other users
                  </span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col">
                  <HelpCircle className="h-6 w-6 mb-2" />
                  <span className="font-medium">Video Tutorials</span>
                  <span className="text-xs text-muted-foreground">
                    Step-by-step guides
                  </span>
                </Button>
              </div>
            </div>

            <Separator />

            {/* App Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">App Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Version:
                  </span>
                  <p>1.0.0</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Last Updated:
                  </span>
                  <p>August 2025</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Platform:
                  </span>
                  <p>Web Application</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Status:
                  </span>
                  <p className="text-green-600">All Systems Operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
