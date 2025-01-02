"use client";

import { Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative">
        {/* Road */}
        <div className="absolute bottom-0 left-1/2 h-1 w-40 -translate-x-1/2 transform bg-gray-400" />

        {/* Animated truck */}
        <motion.div
          animate={{
            x: [-20, 20],
            y: [0, -1, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              ease: "easeInOut",
            },
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
          className="relative"
        >
          <Truck className="h-20 w-20 text-yellow-400" />
        </motion.div>
        {/* Loading text */}
        <motion.p
          className="mt-4 text-lg font-semibold text-gray-700"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
