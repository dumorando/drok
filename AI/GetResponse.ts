import type { AIResponse } from "../Types/AIResponses";
import { DrokMode } from "../Types/Model";
import type { ClassifiedPromptBuilderOutput, PromptBuilderOptions } from "../Types/PromptBuilder";
import BuildPromptWithClassification from "./BuildPromptWithClassification";
import SendMessage from "./Responses/Reasoner";
import RegularSendMessage from './Responses/Regular';

export default async function GetClassifiedResponse(prompt: ClassifiedPromptBuilderOutput): Promise<AIResponse> {
    if (prompt.mode === DrokMode.expert) {
        //use reasoner
        return await SendMessage(prompt.built_prompt, { name: 'deepseek-reasoner', friendlyName: 'DeepSeek V3.1 Reasoner' }, prompt.mode);
    } else {
        //use regular
        return await RegularSendMessage(prompt.built_prompt, { name: 'deepseek-chat', friendlyName: 'DeepSeek V3.1' }, prompt.mode);
    }
}