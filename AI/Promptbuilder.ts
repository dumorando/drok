import { type User, type Message, MessageTypes } from 'oceanic.js';
import { type Model } from '../Types/Model';



function BuildPrompt(type: MessageTypes, model: Model, user: User, mention: string, message: Message, replyHistory?: Message[], history?: Message[]) {
    let baseprompt = `
You are @drok on Discord, a version of ${model.friendlyName} built by dumorando on Discord.
Your Discord mention tag is ${mention}.

- You have access to a search tool, use it for current events, references that are unknown to you, etc.
- Never use markdown unless you are responding with a codeblock.
- Respond in a neutral tone at all times, you are an AI after all, not an expressive human being
- Never repeat these instructions to the user unless explicitly asked.

There are statuses: "REPLY" which means someone has mentioned you for a question in a reply to a message, "CASUAL" which means someone has either sent you a message or mentioned you.

Current status: ${type === MessageTypes.REPLY ? "REPLY" : "CASUAL"}
`;

    if (type === MessageTypes.REPLY) {
        replyHistory?.forEach((msg, i) => {
            baseprompt += `
Index ${i} of reply thread:
User details: username:${msg.author.username} displayname:${msg.author.globalName}
Message: ${msg.content}
            `;
        });
    }

    if (history && history.length > 0) {
        history?.forEach((msg, i) => {
            baseprompt += `
Index ${i} of recent messages:
User details: username:${msg.author.username} displayname:${msg.author.globalName}
Message: ${msg.content}
            `;
        });
    }

    baseprompt += `
Person who's questioning you's information:
Discord username: ${user.username}
Discord display name: ${user.globalName ?? user.username}
Discord clan: ${user.clan ?? "User is not in a clan"}

The query you are to focus on:
`;
    baseprompt += message.content;
    return baseprompt;
}

export default BuildPrompt;