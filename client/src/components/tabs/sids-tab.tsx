import { motion } from "framer-motion";

export default function SidsTab() {
  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <i className="fas fa-route text-8xl text-aviation-blue"></i>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            SIDs Database
          </h2>
          
          <p className="text-lg text-text-secondary mb-6">
            Standard Instrument Departures
          </p>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-aviation-blue/10 border border-aviation-blue/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-aviation-blue mb-3">
              Coming Soon
            </h3>
            <p className="text-text-secondary">
              We're working on integrating a comprehensive database of Standard Instrument Departures 
              from major airports worldwide. This feature will include interactive procedures, 
              waypoint information, and real-time updates.
            </p>
          </motion.div>
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-text-muted"
          >
            <i className="fas fa-clock mr-2"></i>
            Expected in next update
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}