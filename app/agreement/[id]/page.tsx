import React, { Suspense } from "react";
import DigitalAgreementView from "@/components/DigitalAgreementView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AgreementPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-8 text-gray-950 font-black">
          Loading Official Rental Agreement...
        </div>
      }
    >
      <DigitalAgreementView agreementId={resolvedParams.id} />
    </Suspense>
  );
}
