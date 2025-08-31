import type { Model } from "../Types/Model";
import { generateText, stepCountIs } from "ai";
import toolparent from "./Tools";
import { deepseek } from "@ai-sdk/deepseek";

interface MathToolInput {
    equation: string;
}

interface SearchToolInput {
    query: string;
}

async function SendMessage(prompt: string, model: Model) {
    const tp = toolparent();
    const { text } = await generateText({
        model: deepseek(model.name),
        tools: tp.tools,
        prompt,
        stopWhen: stepCountIs(10)
    });


    const toolsummary = tp.getToolUsage().map(toolcall => {
        if (toolcall.type == "math") {
            const r = toolcall.equation;
            return `🧮 Solved equation "\`${r}\`"`;
        } else {
            const r = toolcall.query;
            return `🌐 Searched for "\`${r}\`"`;
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