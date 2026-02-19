"use client";

import HeaderUnified from "@/components/layout/HeaderUnified";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full">
      <HeaderUnified />
      {children}
    </div>
  );
}
