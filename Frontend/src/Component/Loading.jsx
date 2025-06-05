import { motion } from "framer-motion";
import { FaDumbbell } from "react-icons/fa";

function Loading() {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="flex items-center space-x-8  h-96">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaDumbbell className="text-orange-500 text-4xl" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="flex flex-col items-center"
        >
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent"
          >
            Loading...
          </motion.span>
        </motion.div>

        {/* Right Dumbbell - Opposite animation of left */}
        <motion.div
          animate={{
            y: [-20, 0, -20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaDumbbell className="text-orange-500 text-4xl" />
        </motion.div>
      </div>
    </div>
  );
}

export default Loading;