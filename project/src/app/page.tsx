'use client';
import { useState } from 'react';

import { useVaaniStore, TargetVaani, OutputLanguage } from '@/store/useVaaniStore';
import { ShudhikaranButton } from '@/components/ShudhikaranButton';
import { TextInput } from '@/components/TextInput';
import { OutputDisplay } from '@/components/OutputDisplay';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  const {
    rawInput,
    setRawInput,
    targetVaani,
    setTargetVaani,
    outputLanguage,
    setOutputLanguage,
    purifiedOutput,
    setPurifiedOutput,
    isPurifying,
    setIsPurifying,
    showTearAnimation,
    triggerTearAnimation,
    frozenRawInput
  } = useVaaniStore();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handlePurify = async () => {
    if (!rawInput.trim()) return;
    
    setIsPurifying(true);
    console.log('[Frontend Log] Starting purification process for target:', targetVaani);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn('[Frontend Log] API call timed out after 45s!');
        controller.abort();
    }, 45000);

    try {
      console.log('[Frontend Log] Sending fetch request to /api/purify...');
      const res = await fetch('/api/purify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput, targetVaani, targetLanguage: outputLanguage }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log('[Frontend Log] Received fetch response status:', res.status);
      
      const data = await res.json();
      console.log('[Frontend Log] Received JSON data:', data);

      if (!res.ok) {
         throw new Error(`API Error ${res.status}: ${data.error || 'Unknown error'}`);
      }
      
      setPurifiedOutput(data.purifiedOutput || "");
      setIsPurifying(false);
      triggerTearAnimation();
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error('[Frontend Log] Caught error during purification:', e);
      let errorMsg = "An error occurred while purifying. Please try again.";
      if (e.name === 'AbortError') {
          errorMsg = "The request timed out. Please try again.";
      } else if (e.message) {
          errorMsg = e.message;
      }
      setPurifiedOutput(errorMsg);
      setIsPurifying(false);
      triggerTearAnimation();
    }
  };

  const targets: TargetVaani[] = ['Global Corporate', 'Sarkari/Official', 'Modern Indian Professional'];
  const languages: OutputLanguage[] = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Assamese', 'Hinglish', 'Marathi-English', 'Tanglish', 'Tenglish', 'Kanglish', 'Manglish', 'Assamese-English'];

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col pt-12">
      <h1 className="text-6xl md:text-7xl font-serif font-bold italic tracking-wider text-golden-yellow text-center mb-12 drop-shadow-xl" style={{ textShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' }}>
        Vaani Shudhikaran
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center h-full">
        {/* Left pane: Input */}
        <TextInput 
          value={rawInput} 
          onChange={setRawInput} 
          disabled={isPurifying}
          frozenValue={frozenRawInput}
        />

        {/* Center pane: Controls */}
        <div className="flex flex-col items-center justify-center gap-8 py-8 lg:py-0 min-w-[220px]">
          <div className="flex flex-col gap-8 w-full">
             <div className="flex flex-col gap-2 items-center w-full relative z-50">
                <label className="text-xs uppercase tracking-widest text-off-white/50 text-center">Output Language</label>
                <div className="relative w-full">
                   <button 
                     onClick={() => setIsLangOpen(!isLangOpen)}
                     className="w-full flex items-center justify-between px-4 py-3 bg-input-bg border border-subtle-border rounded text-sm text-off-white font-mono hover:border-dull-gold transition-colors"
                   >
                     <span>{outputLanguage}</span>
                     <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isLangOpen && (
                     <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-[220px] overflow-y-auto flex flex-col border border-subtle-border rounded bg-pitch-black shadow-2xl">
                       {languages.map((l) => (
                         <button 
                           key={l}
                           onClick={() => { setOutputLanguage(l); setIsLangOpen(false); }}
                           className={`px-4 py-3 text-xs font-mono transition-colors text-left border-b border-subtle-border last:border-b-0
                             ${outputLanguage === l ? 'bg-input-bg text-golden-yellow font-bold border-l-2 border-l-golden-yellow' : 'text-off-white bg-pitch-black hover:bg-input-bg hover:text-golden-yellow/70 border-l-2 border-l-transparent'}
                           `}
                         >
                           {l}
                         </button>
                       ))}
                     </div>
                   )}
                </div>
             </div>

             <div className="flex flex-col gap-2 items-center w-full">
                <label className="text-xs uppercase tracking-widest text-off-white/50 text-center">Target Vaani</label>
                <div className="relative inline-flex flex-col border border-subtle-border rounded bg-input-bg overflow-hidden shadow-lg w-full">
                   {targets.map((t) => (
                     <button 
                       key={t}
                       onClick={() => setTargetVaani(t)}
                       className={`px-4 py-3 text-xs font-mono transition-colors text-left border-b border-subtle-border last:border-b-0
                         ${targetVaani === t ? 'bg-pitch-black text-golden-yellow font-bold border-l-2 border-l-golden-yellow' : 'text-off-white hover:bg-subtle-border/30 hover:text-golden-yellow/70 border-l-2 border-l-transparent'}
                       `}
                     >
                       {t}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <ShudhikaranButton onClick={handlePurify} isLoading={isPurifying} disabled={!rawInput.trim() && !showTearAnimation} />
        </div>

        {/* Right pane: Output (The Tearing Canvas) */}
        <OutputDisplay 
          purifiedOutput={purifiedOutput} 
          showTearAnimation={showTearAnimation} 
          frozenRawInput={frozenRawInput} 
        />
      </div>
    </main>
  );
}
