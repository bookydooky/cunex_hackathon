"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TokenHandler({
  setGotToken,
}: {
  setGotToken: (value: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("TOKEN", token);
      setGotToken(true);
    }
  }, [token, setGotToken]);

  return null; // No UI needed
}
