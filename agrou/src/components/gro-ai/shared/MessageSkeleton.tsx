import { motion } from "motion/react";

interface MessageSkeletonProps {
  label?: string;
}

export function MessageSkeleton({ label = "Gro AI sedang menganalisis..." }: MessageSkeletonProps) {
  return (
    <div className="flex gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-[#b5f23d]/20 border border-[#b5f23d]/30 shrink-0 flex items-center justify-center">
        <span className="text-[10px]">🌱</span>
      </div>

      <div className="flex-1 space-y-2 pt-0.5">
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#b5f23d] text-xs font-bold">Gro AI</span>
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 bg-[#b5f23d] rounded-full block"
                animate={{ y: [0, -3, 0] }}
                transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Skeleton lines */}
        <div className="space-y-2">
          <motion.div
            className="h-2.5 bg-white/10 rounded-full"
            style={{ width: "85%" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div
            className="h-2.5 bg-white/10 rounded-full"
            style={{ width: "70%" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div
            className="h-2.5 bg-white/10 rounded-full"
            style={{ width: "55%" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>

        <p className="text-white/30 text-[10px] mt-2">{label}</p>
      </div>
    </div>
  );
}
