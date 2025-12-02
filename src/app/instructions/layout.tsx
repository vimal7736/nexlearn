"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

interface InstructionsLayoutProps {
  children: ReactNode;
}

export default function InstructionsLayout({ children }: InstructionsLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
