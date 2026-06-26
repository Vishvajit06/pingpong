import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

interface ModerationResult {
  isToxic: boolean;
  severity: number;
  confidence: number;
  categories: string[];
  reason: string;
}

export async function checkToxicity(
  message: string
): Promise<ModerationResult> {
  try {
    const prompt = `
You are an enterprise-grade content moderation system.

Analyze the message and detect:

- Hate Speech
- Harassment
- Bullying
- Personal Attacks
- Threats
- Violence
- Sexual Content
- Sexual Harassment
- Self Harm
- Suicide Encouragement
- Extremism
- Terrorism Support
- Scams
- Fraud Attempts
- Doxxing
- Illegal Activities
- Severe Profanity

Rules:
- Understand context.
- Detect disguised profanity.
- Detect slang and abbreviations.
- Detect indirect threats.
- Detect repeated harassment.
- Ignore normal disagreements.
- Ignore constructive criticism.
- Ignore harmless jokes unless clearly abusive.

Return ONLY valid JSON:

{
  "isToxic": boolean,
  "severity": number,
  "confidence": number,
  "categories": string[],
  "reason": string
}

Severity:
0 = completely safe
1-3 = mild
4-6 = moderate
7-8 = severe
9-10 = extreme

Message:
${JSON.stringify(message)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const parsed = JSON.parse(text);

    return {
      isToxic: Boolean(parsed.isToxic),
      severity: Number(parsed.severity || 0),
      confidence: Number(parsed.confidence || 0),
      categories: Array.isArray(parsed.categories)
        ? parsed.categories
        : [],
      reason: parsed.reason || "No reason provided",
    };
  } catch (error) {
    console.error("Moderation Error:", error);

    return {
      isToxic: false,
      severity: 0,
      confidence: 0,
      categories: [],
      reason: "Moderation unavailable",
    };
  }
}