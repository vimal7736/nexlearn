import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "../context/ToastContext";
import StoreProvider from "../store/providers/StoreProvider";


export const metadata = {
  title: "NexLern",
  description: "Learning platform",
};



const inter = Inter({
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
