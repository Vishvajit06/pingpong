import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';



export const maxDuration = 30;

export async function POST() {
  const prompt = "Suggest a list of short messages, each one about AI, DevOps, Engineering, or a friendly personal invitation (like asking someone to dinner, asking about their habits, or what new skills they’re learning). Each message should be warm, clear, and under 25 words. Separate each message with ||."

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      prompt,
    });
  
    return result.toDataStreamResponse();
  } catch (error) {

    console.log("no response from the ai",error)
    return NextResponse.json({
        messages:"no response form ai",
        success:false
    },{status:500})
  }
}