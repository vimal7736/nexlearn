"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function ExamLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
