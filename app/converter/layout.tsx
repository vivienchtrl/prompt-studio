import { GoogleAdsense } from "@/components/google-adsense";

export default function ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAdsense pId="7048367176497618" />
      {children}
    </>
  );
}

