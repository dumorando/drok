import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { Model } from "../Types/Model";
import { generateText, stepCountIs } from "ai";
import toolparent from "./Tools";

const pollinations = createOpenAICompatible({
    baseURL: 'https://text.pollinations.ai/v1',
    name: 'Pollinations',
    apiKey: process.env.POLLINATIONS_KEY //for better models, but we arent even using them so it kinda doenst matter
});

interface MathToolInput {
    equation: string;
}

interface SearchToolInput {
    query: string;
}

async function SendMessage(prompt: string, model: Model) {
    const tp = toolparent();
    const { text } = await generateText({
        model: pollinations.chatModel(model.name),
        tools: tp.tools,
        prompt,
        stopWhen: stepCountIs(5)
    });


    const toolsummary = tp.getToolUsage().map(toolcall => {
        if (toolcall.type == "math") {
            const r = toolcall.equation;
            return `🧮 Solved equation "${r}"`;
        } else {
            const r = toolcall.query;
            return `🌐 Searched for "${r}"`
        }
    }).join(', ');

    if (toolsummary.length > 0) {
        return `${text}
        
-# ${toolsummary}`
    } else {
        return text;
    }
}

export default SendMessage;