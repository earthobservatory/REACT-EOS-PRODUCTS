//Stores and provides the data defined by AuthContext to all the components below it

import React, { useState } from "react";
import { useEffect } from "react";
import { MetadataContext } from "context/MetadataContext";

const MetadataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState();

  useEffect(() => {
    const response = fetch(
      "http://aria-sg-products.s3-website-ap-southeast-1.amazonaws.com/metadata.json"
    )
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
