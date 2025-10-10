import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface GuideStepProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  imagePlaceholder?: string;
  image?: string; // Path to real image (e.g., "/guides/dashboard/overview.png")
  imageAlt?: string;
  additionalImage?: string; // Path to second image
  additionalImageAlt?: string;
  tip?: string;
  warning?: string;
}

export function GuideStep({
  stepNumber,
  title,
  children,
  imagePlaceholder,
  image,
  imageAlt = "Step illustration",
  additionalImage,
  additionalImageAlt = "Additional illustration",
  tip,
  warning,
}: GuideStepProps) {
  return (
    <div className="mb-8 last:mb-0">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm">
          {stepNumber}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Step Content */}
      <div className="ml-11 space-y-4">
        <div className="text-gray-700 leading-relaxed">{children}</div>

        {/* Real Image */}
        {image && (
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <Image
                src={image}
                alt={imageAlt}
                width={1200}
                height={800}
                className="w-full h-auto"
                priority={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Additional Image */}
        {additionalImage && (
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <Image
                src={additionalImage}
                alt={additionalImageAlt}
                width={1200}
                height={800}
                className="w-full h-auto"
                priority={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Image Placeholder */}
        {!image && imagePlaceholder && (
          <Card className="overflow-hidden bg-gray-100 py-0">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="text-center p-8">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm font-medium text-gray-600">
                    {imagePlaceholder}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Screenshot placeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tip */}
        {tip && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Badge className="bg-blue-600 hover:bg-blue-700 h-fit">
                  💡 Tip
                </Badge>
                <p className="text-sm text-blue-900">{tip}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning */}
        {warning && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Badge className="bg-amber-600 hover:bg-amber-700 h-fit">
                  ⚠️ Note
                </Badge>
                <p className="text-sm text-amber-900">{warning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
