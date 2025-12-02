"use client";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-image">
        <Image src="/Group.svg" alt="Loading" width={120} height={120} />
      </div>

      <div className="loader"></div>
    </div>
  );
}
