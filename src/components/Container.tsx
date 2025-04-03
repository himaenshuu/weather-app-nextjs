/** @format */

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
      className={cn(
        "w-full bg-white border rounded-xl flex py-4 shadow-sm",
        "dark:bg-gray-800 dark:border-gray-700",
        "hover:shadow-md dark:hover:shadow-gray-700/30",
        "transition-all duration-200",
        props.className
      )}
    />
  );
}
