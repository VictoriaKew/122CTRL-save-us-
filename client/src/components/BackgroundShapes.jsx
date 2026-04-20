import { motion } from 'framer-motion';

export default function BackgroundShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-white">
      {/* Blue Shape */}
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -left-20 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60"
      />
      {/* Purple Shape */}
      <motion.div 
        animate={{ x: [0, -50, 0], y: [0, -100, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-60"
      />
    </div>
  );
}