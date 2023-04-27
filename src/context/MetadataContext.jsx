import { createContext, useContext } from "react";

export const MetadataContext = createContext(Array);

export const useMetadataContext = () => useContext(MetadataContext);
