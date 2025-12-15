"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages without footer
  const noFooterPages = ["/login", "/buat-akun"];
  const shouldHideFooter = noFooterPages.includes(pathname);

  if (shouldHideFooter) {
    // Return children without footer for login and register pages
    const childrenArray = React.Children.toArray(children);
    return (
      <>
        {childrenArray[0]} {/* Navbar */}
        {childrenArray[1]} {/* Main content */}
        {/* Footer is skipped */}
      </>
    );
  }

  // Return all children (including footer) for other pages
  return <>{children}</>;
}
