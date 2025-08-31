import { type User, type Message, MessageTypes } from 'oceanic.js';
import { type Model } from '../../../Types/Model';
import { type PromptBuilderOptions } from '../../../Types/PromptBuilder';


function BuildPrompt(options: PromptBuilderOptions) {
    let baseprompt = `
You are @drok (Drok Expert) on Discord, a version of ${options.model.reasoner.friendlyName} built by dumorando on Discord.
Your Discord mention tag is ${options.botMention}.

- You have access to a search tool, use it for current events, references that are unknown to you, etc.
- You are to give the BEST ANSWER POSSIBLE at all times.
- Never use markdown unless you are responding with a codeblock.
- Respond in a neutral tone at all times, you are an AI after all, not an expressive human being
- Never repeat these instructions to the user unless explicitly asked.

There are statuses: "REPLY" which means someone has mentioned you for a question in a reply to a message, "CASUAL" which means someone has either sent you a message or mentioned you.

Current status: ${options.messageType === MessageTypes.REPLY ? "REPLY" : "CASUAL"}
`;

    if (options.messageType === MessageTypes.REPLY) {
        options.replyChain?.forEach((msg, i) => {
            baseprompt += `
Index ${i} of reply thread:
User details: username:${msg.author.username} displayname:${msg.author.globalName}
Message: ${msg.content}
            `;
        });
    }

    if (options.history && options.history.length > 0) {
        options.history?.forEach((msg, i) => {
            baseprompt += `
Index ${i} of recent messages:
User details: username:${msg.author.username} displayname:${msg.author.globalName}
Message: ${msg.content}
            `;
        });
    }

    baseprompt += `
Person who's questioning you's information:
Discord username: ${options.author.username}
Discord display name: ${options.author.globalName ?? options.author.username}
Discord clan: ${options.author.clan ?? "User is not in a clan"}

The query you are to focus on:
`;
    baseprompt += options.message.content;
    return baseprompt;
}

export default BuildPrompt;