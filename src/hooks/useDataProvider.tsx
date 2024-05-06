// Data Provider Hook

import {DataContext} from "@/context/DataContext";
import { useContext } from "react";

const useDataProvider = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataProvider must be used within a DataProvider");
  }
  return context;
};

export default useDataProvider;
