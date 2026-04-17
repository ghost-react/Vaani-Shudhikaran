'use client';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  frozenValue?: string;
}

export const TextInput = ({ value, onChange, disabled, frozenValue }: Props) => {
  const showFrozen = !value && !!frozenValue;

  return (
    <div className="flex-1 flex flex-col gap-4">
      <label className="text-sm uppercase tracking-widest text-off-white/70">Raw Vaani</label>
      <div className="relative w-full h-[300px]">
        {showFrozen && (
          <div className="absolute inset-0 border border-subtle-border bg-input-bg/50 p-4 rounded-md font-mono text-off-white/40 whitespace-pre-wrap overflow-y-auto pointer-events-none break-words italic">
            {frozenValue}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`relative z-10 w-full h-full border border-subtle-border p-4 rounded-md font-mono text-off-white glow-focus resize-none transition-all duration-150 ease-in-out disabled:opacity-50 hover:border-dull-gold hover:cursor-text focus:border-golden-yellow ${showFrozen ? 'bg-transparent text-transparent caret-off-white' : 'bg-input-bg text-off-white'}`}
          placeholder={showFrozen ? "" : "Type your impulsive/intrusive thought here (Hinglish, Marathi, etc)..."}
        />
      </div>
    </div>
  );
};
