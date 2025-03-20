"use client"; // Required for stateful components in Next.js App Router

import { createContext, useState, ReactNode } from "react";

// Define the shape of the global state
interface GlobalStateContextType {
  service: string;
  setService: (service: string) => void;
}

// Create a context with default undefined value
export const GlobalStateContext = createContext<GlobalStateContextType>({
  service: "",
  setService: () => {},
});

// Provider component
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState("");

  return (
    <GlobalStateContext.Provider value={{ service, setService }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
