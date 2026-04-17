import { create } from 'zustand';

export type TargetVaani = 'Global Corporate' | 'Sarkari/Official' | 'Modern Indian Professional';
export type OutputLanguage = 'English' | 'Hindi' | 'Marathi' | 'Tamil' | 'Telugu' | 'Kannada' | 'Malayalam' | 'Assamese' | 'Hinglish' | 'Marathi-English' | 'Tanglish' | 'Tenglish' | 'Kanglish' | 'Manglish' | 'Assamese-English';

interface VaaniState {
  rawInput: string;
  setRawInput: (input: string) => void;
  frozenRawInput: string;
  targetVaani: TargetVaani;
  setTargetVaani: (target: TargetVaani) => void;
  outputLanguage: OutputLanguage;
  setOutputLanguage: (language: OutputLanguage) => void;
  purifiedOutput: string;
  setPurifiedOutput: (output: string) => void;
  isPurifying: boolean;
  setIsPurifying: (loading: boolean) => void;
  showTearAnimation: boolean;
  setShowTearAnimation: (show: boolean) => void;
  triggerTearAnimation: () => void;
}

export const useVaaniStore = create<VaaniState>((set, get) => ({
  rawInput: '',
  setRawInput: (input) => {
    const state = get();
    if (state.showTearAnimation) {
      set({ rawInput: input, showTearAnimation: false, purifiedOutput: '', frozenRawInput: '' });
    } else {
      set({ rawInput: input, showTearAnimation: false, purifiedOutput: '' });
    }
  },
  frozenRawInput: '',
  targetVaani: 'Global Corporate',
  setTargetVaani: (target) => set({ targetVaani: target }),
  outputLanguage: 'English',
  setOutputLanguage: (language) => set({ outputLanguage: language }),
  purifiedOutput: '',
  setPurifiedOutput: (output) => set({ purifiedOutput: output }),
  isPurifying: false,
  setIsPurifying: (loading) => set({ isPurifying: loading }),
  showTearAnimation: false,
  setShowTearAnimation: (show) => set({ showTearAnimation: show }),
  triggerTearAnimation: () => {
    const { rawInput } = get();
    // Visarjan Step 1: Capture the text dynamically for the 'Tearing' illusion
    set({ frozenRawInput: rawInput, showTearAnimation: true });
    
    // Visarjan Step 2: Instantly clear the live state 'rawInput' for cathartic disposal
    set({ rawInput: '' });
  }
}));
