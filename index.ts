import { Client, MessageTypes } from 'oceanic.js';
import Promptbuilder from './AI/Promptbuilder';
import { type Model } from './Types/Model';
import SendMessage from './AI/Pollinations';
import GetReplyChain from './Misc/GetReplyChain';

const client = new Client({ auth: `Bot ${process.env.DISCORD_TOKEN}` });
const model: Model = {
    friendlyName: 'GPT-4.1',
    name: 'openai'
};

client.on("ready", async()=>{
    console.log("Ready as", client.user.tag);
});

client.on("messageCreate", async(m)=>{
    if (m.author.bot) {
        return;
    }
    
    if (m.type === MessageTypes.REPLY) {
        if (m.content.includes(client.user.mention)) {
            const replychain = await GetReplyChain(m);
            const builtprompt = Promptbuilder(m.type, model, m.author, client.user.mention, m, replychain);
            
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