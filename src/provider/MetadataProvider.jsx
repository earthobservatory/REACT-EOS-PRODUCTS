//Stores and provides the data defined by AuthContext to all the components below it

import React, { useState } from "react";
import { useEffect } from "react";
import { MetadataContext } from "context/MetadataContext";
import { METADATA_API } from "utils/constants";

const MetadataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState();

  useEffect(() => {
    const response = fetch(METADATA_API)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setMetadata(result);
      });
  }, []);

  return (
    <MetadataContext.Provider value={metadata}>
      {children}
    </MetadataContext.Provider>
  );
};

export default MetadataProvider;
