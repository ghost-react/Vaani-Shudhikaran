'use client';

import { TearingTextReveal } from './TearingTextReveal';

interface Props {
  purifiedOutput: string;
  showTearAnimation: boolean;
  frozenRawInput: string;
}

export const OutputDisplay = ({ purifiedOutput, showTearAnimation, frozenRawInput }: Props) => {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex justify-between items-center h-[20px]">
        <label className="text-sm uppercase tracking-widest text-off-white/70">Purified Vaani</label>
        {purifiedOutput && !showTearAnimation && (
          <button 
            onClick={() => navigator.clipboard.writeText(purifiedOutput)}
            className="text-xs text-dull-gold hover:text-golden-yellow transition-colors font-mono uppercase tracking-widest border border-dull-gold hover:border-golden-yellow rounded px-2 py-1"
          >
            Copy Drop
          </button>
        )}
      </div>
      
      {showTearAnimation || purifiedOutput ? (
        <TearingTextReveal 
          rawInput={frozenRawInput} 
          purifiedOutput={purifiedOutput} 
          isTearing={showTearAnimation} 
        />
      ) : (
        <div className="w-full h-[300px] border border-subtle-border border-dashed rounded-md bg-input-bg/50 p-4 font-mono text-off-white/30 flex items-center justify-center text-center">
          Your purified thoughts will appear here.
        </div>
      )}
    </div>
  );
};
