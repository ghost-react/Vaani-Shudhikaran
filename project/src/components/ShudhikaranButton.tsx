'use client';

import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ShudhikaranButton = ({ onClick, isLoading, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative group overflow-hidden
        px-8 py-4 bg-pitch-black text-golden-yellow font-bold tracking-widest
        border-2 border-golden-yellow uppercase transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center
      `}
    >
      <div className="absolute inset-0 bg-golden-yellow transition-transform duration-300 transform scale-y-0 origin-bottom group-hover:scale-y-100 group-focus:scale-y-100" />
      <span className="relative z-10 group-hover:text-pitch-black group-focus:text-pitch-black flex items-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            Purifying...
          </>
        ) : (
          'Shudhikaran'
        )}
      </span>
    </button>
  );
};
