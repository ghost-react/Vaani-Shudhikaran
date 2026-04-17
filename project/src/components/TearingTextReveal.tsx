'use client';

import { motion } from 'framer-motion';

interface Props {
  rawInput: string;
  purifiedOutput: string;
  isTearing: boolean;
}

export const TearingTextReveal = ({ rawInput, purifiedOutput, isTearing }: Props) => {
  return (
    <div className="relative w-full h-full min-h-[300px] border border-subtle-border rounded-md overflow-hidden bg-input-bg p-4 font-mono white-space-pre-wrap">
      {/* LAYER 1: The 'Final Purified' Text */}
      <div className="absolute inset-0 z-0 p-4 text-golden-yellow whitespace-pre-wrap">
        {purifiedOutput}
      </div>

      {/* LAYER 2: The 'Raw' Input Text */}
      <motion.div
        className="absolute inset-0 z-10 p-4 text-off-white bg-input-bg whitespace-pre-wrap"
        initial={{ clipPath: 'polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)' }}
        animate={isTearing ? { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)' } : { clipPath: 'polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={isTearing ? {
          borderRight: '2px solid #FBBF24',
          boxShadow: '2px 0 15px rgba(251, 191, 36, 0.8)'
        } : {}}
      >
        {rawInput}
      </motion.div>
      
      {/* The Glow Edge Effect synchronized with the tear */}
      {isTearing && (
        <motion.div 
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ background: 'linear-gradient(-45deg, transparent 48%, rgba(251, 191, 36, 0.8) 50%, transparent 52%)', backgroundSize: '200% 200%', backgroundPosition: '100% 100%' }}
            animate={{ backgroundPosition: '0% 0%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};
