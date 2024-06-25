import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="text-center mx-auto mt-20">
      <Link href="/dashboard">Go To Dashboard</Link>
    </div>
  );
}
