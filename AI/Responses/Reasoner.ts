import type { DrokMode, Model } from "../../Types/Model";
import { generateText, stepCountIs } from "ai";
import toolparent from "../Tools";
import { deepseek } from "@ai-sdk/deepseek";
import type { AIResponse } from "../../Types/AIResponses";

async function SendMessage(prompt: string, model: Model, mode: DrokMode): Promise<AIResponse> {
    const tp = toolparent();
    const { text } = await generateText({
        model: deepseek(model.name),
        tools: tp.tools,
        prompt,
        temperature: 0,
        stopWhen: stepCountIs(10)
    });


    const toolsummary = tp.getToolUsage().map(toolcall => {
        const r = toolcall.query;
        return `🌐 Searched for "\`${r}\`"`;
    }).join(', ');

    if (toolsummary.length > 0) {
        return {
            output: `${text}
        
-# ${toolsummary}`,
            mode,
            model
        }
    } else {
        return { output: text, mode, model };
    }
}

export default SendMessage;