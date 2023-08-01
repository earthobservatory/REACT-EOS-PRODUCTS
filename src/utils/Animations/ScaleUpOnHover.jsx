import React, { useState } from "react";
import { motion } from "framer-motion";

const ScaleUpOnHover = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleUpOnHover;
