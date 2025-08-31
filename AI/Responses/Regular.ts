import type { Model } from "../../Types/Model";
import { DrokMode } from "../../Types/Model";
import { generateText, stepCountIs } from "ai";
import toolparent from "../Tools";
import { deepseek } from "@ai-sdk/deepseek";
import type { AIResponse } from "../../Types/AIResponses";

async function SendMessage(prompt: string, model: Model, mode: DrokMode, images?: string[]): Promise<AIResponse> {
    const tp = toolparent();
    const imgs = images ?? [];
    const { text } = await generateText({
        model: deepseek(model.name),
        tools: tp.tools,
        messages: [
            {
                role: "user",
                content: [
                    { type: 'text', text: prompt },
                    ...imgs.map(url => ({ type: "image" as const, image: url as string }))
                ]
            }
        ],
        temperature: mode === DrokMode.creative ? 1.5 : 1.3,
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
        };
    } else {
        return {
            output: text,
            mode,
            model
        };
    }
}

export default SendMessage;