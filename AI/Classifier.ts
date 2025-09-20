import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { PromptClassification } from '../Types/Classification';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});

async function ClassifyPrompt(prompt: string) {
    const { text } = await generateText({
        model: openrouter('meta-llama/llama-4-maverick:free'),
        temperature: 0,
        prompt: `Take the following prompt, and determine whether it is a coding/math question, creative question, or in the last case, conversational question.

"coding_math", "creative", "conversation" Just respond with one of those words. Thats all you are allowed to say.

Prompt: ${prompt}`,
        maxOutputTokens: 20
    });

    const result = text.trim();
    if (result === "coding_math") return PromptClassification.coding_math;
    if (result === "creative") return PromptClassification.creative;
    if (result === "conversation") return PromptClassification.conversation;

    return PromptClassification.conversation;
}

export default ClassifyPrompt;