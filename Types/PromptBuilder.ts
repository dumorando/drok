import type { Message, MessageTypes, User } from "oceanic.js";
import type { DrokMode, ModelOptions } from "./Model";

// m.type, model, m.author, client.user.mention, m, replychain, history
export interface PromptBuilderOptions {
    messageType: MessageTypes;
    model: ModelOptions;
    author: User;
    botMention: string;
    message: Message;
    replyChain?: Message[];
    history?: Message[];
}

export interface ClassifiedPromptBuilderOutput {
    built_prompt: string,
    mode: DrokMode
}