import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Dashboard",
  description: "Manage your reviews and feedback",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {children}
    </div>
  );
} 