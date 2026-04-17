import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const { rawInput, targetVaani, targetLanguage } = await req.json();
    console.log(`[Backend Log] Received request body. targetVaani: ${targetVaani}, targetLanguage: ${targetLanguage}, rawInput exists: ${!!rawInput}`);

    if (!rawInput) {
      console.log('[Backend Log] Error: Raw input is missing.');
      return NextResponse.json({ error: 'Raw input is required' }, { status: 400 });
    }

    console.log('[Backend Log] GEMINI_API_KEY status:', apiKey ? 'Loaded' : 'Missing');

    if (!genAI) {
      console.log('[Backend Log] Returning mocked response due to missing API key.');
      // Mocked response if no API key is present
      return NextResponse.json({
        purifiedOutput: `Mocked response for ${targetVaani}:\n\nYour message has been processed successfully. (Provide GEMINI_API_KEY in .env.local to see real AI results from Gemini Flash.)\n\nOriginal thought pattern: ${rawInput.substring(0, 50)}...`
      });
    }

    console.log('[Backend Log] Initializing Gemini safety settings...');
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const systemPrompt = `You are the esteemed 'Vaani Shudhikaran' AI, a high-end linguistic scholar and custodian of communicative dharma. 
The user will provide an outburst of raw, unrefined 'Vaani' (speech) which may be fraught with frustration, impulsive vernacular, and mixed languages (typically English, Hinglish, Marathi-English, or regional dialects).

Your sacred duty is the art of 'Shudhikaran' (Purification).
You do not merely fix grammar; you elevate the 'Aukaat' (stature, dignity, and gravitas) of the speech.

Your Workflow Ritual:
1. Absorb the emotional core or fundamental grievance within the crude input.
2. Filter away all impulsive, colloquial, or degrading elements without losing the core intent.
3. Transmute this intent into a highly refined, eloquent expression matching the requested 'Target Vaani' persona.

The chosen 'Target Vaani' persona is: ${targetVaani}.
The requested Output Language is: ${targetLanguage || 'English'}.
Strictly format your output based on this persona and language:
- 'Global Corporate': Impeccable, C-suite level communication. Authoritative, perfectly diplomatic, and utterly professional.
- 'Sarkari/Official': Utterly formal, bureaucratic standard communication. The tone of a gazetted officer's official notice.
- 'Modern Indian Professional': Polished, highly articulate communication infused with subtle, respectful Indian professional warmth (e.g., acknowledging context, maintaining respect for hierarchy implicitly).

Ensure the final purified text is WRITTEN ENTIRELY IN ${targetLanguage || 'English'}.
CRUCIAL SCRIPT RULE: 
1. If the requested language is a hybrid ending in 'glish' (Hinglish, Tanglish, Kanglish, Tenglish, Manglish) or '-English' (Marathi-English, Assamese-English), you MUST construct the sentence using the grammar, meaning, and vocabulary of the native language (Hindi, Tamil, Kannada, Telugu, Malayalam, Marathi, Assamese), BUT type it out entirely using the English alphabet (Romanized script). Under no circumstances should you use native scripts (e.g., Devanagari, Tamil script) for these hybrid options. 
2. Conversely, if a PURE regional language is selected (e.g., Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam, Assamese), you MUST write the output explicitly in its true NATIVE original script (Devanagari, Tamil script, etc.). DO NOT use English alphabets for pure regional languages.
Maintain the strict persona tone.
Deliver ONLY the purified, elevated text. Do not provide commentary on your process.`;

    console.log('[Backend Log] Sending prompt to gemini-2.5-flash...');
    let text = '';
    
    const generateWithModel = async (modelName: string) => {
      const activeModel = genAI.getGenerativeModel({ model: modelName, safetySettings });
      const result = await activeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Raw Impulsive Thought: ${rawInput}` }] }],
        systemInstruction: { role: 'system', parts: [{text: systemPrompt }] },
      });

      const response = await result.response;
      const promptFeedback = response.promptFeedback;
      if (promptFeedback && promptFeedback.blockReason) {
        throw new Error(`Prompt was blocked: ${promptFeedback.blockReason}`);
      }
      return response.text();
    };

    try {
      text = await generateWithModel("gemini-2.5-flash");
      console.log('[Backend Log] Received raw response from gemini-2.5-flash:', text);
    } catch (apiError: any) {
      console.error('[Backend Log] Specific Gemini API Error occurred during generateContent (2.5-flash):', apiError.message || apiError);
      
      // If the model is heavily overloaded (503/500/429), fall back to 1.5-flash
      const isOverloaded = apiError.status === 503 || apiError.status === 429 || apiError.status === 500 || (apiError.message && (apiError.message.includes('503') || apiError.message.includes('429')));
      
      if (isOverloaded) {
          console.warn('[Backend Log] gemini-2.5-flash is temporarily unavailable. Attempting fallback to gemini-1.5-flash...');
          try {
             text = await generateWithModel("gemini-1.5-flash");
             console.log('[Backend Log] Received raw response from fallback model gemini-1.5-flash:', text);
          } catch (fallbackError: any) {
             console.error('[Backend Log] Fallback gemini-1.5-flash also failed:', fallbackError.message || fallbackError);
             throw fallbackError;
          }
      } else {
        // Attempt to inspect response properties if safety blocked it post-generation
        if (apiError.response && apiError.response.candidates && apiError.response.candidates[0].finishReason) {
            console.error('[Backend Log] Finish Reason:', apiError.response.candidates[0].finishReason);
        }
        throw apiError;
      }
    }

    return NextResponse.json(
      { purifiedOutput: text.trim() },
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Backend Log] Purify API Error:', error);
    return NextResponse.json({ error: 'Failed to purify text', details: String(error) }, { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
