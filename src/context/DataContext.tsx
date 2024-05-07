import { createContext, useMemo, useState } from "react";
export interface DataContextProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  updatePage: (value: PageAction) => void;
}

export const DataContext = createContext<DataContextProps | null>(null);
export enum PageAction {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
}

export interface DataProviderProps {
  children: React.ReactNode;
}
export const BASE_URL = "http://192.168.1.151:5001";
// export const BASE_URL = "http://192.168.1.143:5000";

const DataProvider = ({ children }: DataProviderProps) => {
  const [page, setPage] = useState(1);

  const updatePage = (value: PageAction) => {
    if (value === PageAction.PREVIOUS) {
      setPage((prev) => (prev === 1 ? 4 : prev - 1));
    } else {
      setPage((prev) => (prev === 4 ? 1 : prev + 1));
    }
  };

  const value = useMemo(
    () => ({ page, setPage, updatePage }),
    [page, setPage, updatePage]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
