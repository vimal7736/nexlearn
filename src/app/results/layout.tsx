"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

interface ResultsLayoutProps {
  children: ReactNode;
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
