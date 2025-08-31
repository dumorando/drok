import { ChannelTypes, Client, MessageTypes } from 'oceanic.js';
import Promptbuilder from './AI/Promptbuilder';
import { type Model } from './Types/Model';
import SendMessage from './AI/Messageservice';
import GetReplyChain from './Misc/GetReplyChain';
import ClassifyPrompt from './AI/Classifier';

const client = new Client({ auth: `Bot ${process.env.DISCORD_TOKEN}` });
const model: Model = {
    friendlyName: 'DeepSeek V3.1',
    name: 'deepseek-chat'
};

client.on("ready", async () => {
    console.log("Ready as", client.user.tag);
});

client.on("messageCreate", async (m) => {
    if (m.author.bot) {
        return;
    }

    let channel = client.getChannel(m.channelID);
    if (!channel) {
        channel = await client.rest.channels.get(m.channelID);   
    }

    if (channel.type === ChannelTypes.DM) {
        if (m.type === MessageTypes.DEFAULT) {
            const recent = await m.channel?.getMessages({ limit: 8, before: m.id });
            const history = (recent ?? [])
                .filter(msg => !!msg.content)
                .reverse();
            const builtprompt = Promptbuilder(m.type, model, m.author, client.user.mention, m, undefined, history);

            await m.channel?.sendTyping();
            await m.channel?.createMessage({
                content: await SendMessage(builtprompt, model),
                messageReference: {
                    messageID: m.id
                }
            });

            return;
        }

        if (m.type === MessageTypes.REPLY) {
            const replychain = await GetReplyChain(m);
            const builtprompt = Promptbuilder(m.type, model, m.author, client.user.mention, m, replychain);

            await m.channel?.sendTyping();
            await m.channel?.createMessage({
                content: await SendMessage(builtprompt, model),
                messageReference: {
                    messageID: m.id
                }
            });

            return;
        }
    }

    if (m.type === MessageTypes.REPLY) {
        if (m.content.includes(client.user.mention)) {
            const replychain = await GetReplyChain(m);
            const builtprompt = Promptbuilder(m.type, model, m.author, client.user.mention, m, replychain);

            await m.channel?.sendTyping();
            await m.channel?.createMessage({
                content: await SendMessage(builtprompt, model),
                messageReference: {
                    messageID: m.id
                }
            });
        }
    }

    if (m.type === MessageTypes.DEFAULT) {
        if (m.content.includes(client.user.mention)) {
            const builtprompt = Promptbuilder(m.type, model, m.author, client.user.mention, m);

            await m.channel?.sendTyping();
            await m.channel?.createMessage({
                content: await SendMessage(builtprompt, model),
                messageReference: {
                    messageID: m.id
                }
            });
        }
    }
});

client.on("error", (err) => {
    console.error("Something Broke!", err);
});

client.connect();