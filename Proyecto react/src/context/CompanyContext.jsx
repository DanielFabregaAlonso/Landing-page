import { createContext, useContext, useMemo } from "react";
import { COMPANY } from "../constants/company";

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const value = useMemo(() => COMPANY, []);
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
