"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import { AppDispatch } from "@/src/store";
import { logout } from "@/src/store/authSlice";
import { useDispatch } from "react-redux";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
 const dispatch = useDispatch<AppDispatch>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, []);

   const handleLogout = () => {
        dispatch(logout());
        router.push('/');
      };
  

  if (checking) return null; 

  return <>
       <Header onLogout={handleLogout} />
      {children}
    </>;
}
