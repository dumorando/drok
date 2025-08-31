import { Attachment, ChannelTypes, Client, Message, MessageTypes, type File, type MessageAttachment } from 'oceanic.js';
import { DrokMode, type Model } from './Types/Model';
import GetReplyChain from './Misc/GetReplyChain';
import ClassifyPrompt from './AI/Classifier';
import BuildPromptWithClassification from './AI/BuildPromptWithClassification';
import GetClassifiedResponse from './AI/GetResponse';
import { GetModeFriendlyName } from './Misc/GetModeFriendlyName';

const client = new Client({ auth: `Bot ${process.env.DISCORD_TOKEN}` });
const regularModel: Model = {
    friendlyName: 'DeepSeek V3.1',
    name: 'deepseek-chat'
};

const reasonerModel: Model = {
    friendlyName: 'DeepSeek V3.1 Reasoner',
    name: 'deepseek-reasoner'
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
            await m.channel?.sendTyping();
            const prompt = await BuildPromptWithClassification({
                messageType: m.type,
                model: { reasoner: reasonerModel, regular: regularModel },
                author: m.author,
                botMention: client.user.mention,
                message: m,
                history
            });
            let message: Message | undefined;
            
            message = await m.channel?.createMessage({
                content: prompt.mode === DrokMode.expert ? `<a:loader:1411546876385431713> Reasoning..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**` : `<a:loader:1411546876385431713> Generating..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**`,
                messageReference: { messageID: m.id }
            });

            const content = (await GetClassifiedResponse(prompt)).output;
            let friendlyContent = content;
            let files: File[] = [];
            if (content.length >= 1500) {
                friendlyContent = `${friendlyContent.slice(0, 1500)}..

**Character limit reached.** The remainder of the content is below.`;

                files.push({
                    name: 'message.md',
                    contents: Buffer.from(content, 'utf8')
                });
            }

            await message?.edit({
                content: friendlyContent,
                files
            });

            return;
        }

        if (m.type === MessageTypes.REPLY) {
            await m.channel?.sendTyping();
            const replychain = await GetReplyChain(m);
            const prompt = await BuildPromptWithClassification({
                messageType: m.type,
                model: { reasoner: reasonerModel, regular: regularModel },
                author: m.author,
                botMention: client.user.mention,
                message: m,
                replyChain: replychain
            });
            let message: Message | undefined;
            
            message = await m.channel?.createMessage({
                content: prompt.mode === DrokMode.expert ? `<a:loader:1411546876385431713> Reasoning..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**` : `<a:loader:1411546876385431713> Generating..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**`,
                messageReference: { messageID: m.id }
            });

            const content = (await GetClassifiedResponse(prompt)).output;
            let friendlyContent = content;
            let files: File[] = [];
            if (content.length >= 1500) {
                friendlyContent = `${friendlyContent.slice(0, 1500)}..

**Character limit reached.** The remainder of the content is below.`;

                files.push({
                    name: 'message.md',
                    contents: Buffer.from(content, 'utf8')
                });
            }

            await message?.edit({
                content: friendlyContent,
                files
            });

            return;
        }
    }

    if (m.type === MessageTypes.REPLY) {
        if (m.content.includes(client.user.mention)) {
            await m.channel?.sendTyping();
            const replychain = await GetReplyChain(m);
            const prompt = await BuildPromptWithClassification({
                messageType: m.type,
                model: { reasoner: reasonerModel, regular: regularModel },
                author: m.author,
                botMention: client.user.mention,
                message: m,
                replyChain: replychain
            });
            let message: Message | undefined;
            
            message = await m.channel?.createMessage({
                content: prompt.mode === DrokMode.expert ? `<a:loader:1411546876385431713> Reasoning..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**` : `<a:loader:1411546876385431713> Generating..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**`,
                messageReference: { messageID: m.id }
            });

            const content = (await GetClassifiedResponse(prompt)).output;
            let friendlyContent = content;
            let files: File[] = [];
            if (content.length >= 1500) {
                friendlyContent = `${friendlyContent.slice(0, 1500)}..

**Character limit reached.** The remainder of the content is below.`;

                files.push({
                    name: 'message.md',
                    contents: Buffer.from(content, 'utf8')
                });
            }

            await message?.edit({
                content: friendlyContent,
                files
            });

            return;
        }
    }

    if (m.type === MessageTypes.DEFAULT) {
        if (m.content.includes(client.user.mention)) {
            await m.channel?.sendTyping();
            const prompt = await BuildPromptWithClassification({
                messageType: m.type,
                model: { reasoner: reasonerModel, regular: regularModel },
                author: m.author,
                botMention: client.user.mention,
                message: m
            });
            let message: Message | undefined;
            
            message = await m.channel?.createMessage({
                content: prompt.mode === DrokMode.expert ? `<a:loader:1411546876385431713> Reasoning..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**` : `<a:loader:1411546876385431713> Generating..\n\nUsing **${GetModeFriendlyName(prompt.mode)}**`,
                messageReference: { messageID: m.id }
            });

            const content = (await GetClassifiedResponse(prompt)).output;
            let friendlyContent = content;
            let files: File[] = [];
            if (content.length >= 1500) {
                friendlyContent = `${friendlyContent.slice(0, 1500)}..

**Character limit reached.** The remainder of the content is below.`;

                files.push({
                    name: 'message.md',
                    contents: Buffer.from(content, 'utf8')
                });
            }

            await message?.edit({
                content: friendlyContent,
                files
            });

            return;
        }
    }
});

client.on("error", (err) => {
    console.error("Something Broke!", err);
});

client.connect();