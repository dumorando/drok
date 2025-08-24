import type { Message } from "oceanic.js";

async function GetReplyChain(message: Message) {
    const chain = [message];
    let current = message;

    while (current.referencedMessage) {
        let ref = current.referencedMessage;

        if (!ref.content) {
            try {
                ref = await current.channel!.getMessage(ref.id);
            } catch (error) {
                console.error("failed to get refrenced message", error);
                break;
            }
        }

        chain.push(ref);
        current = ref;
    }

    return chain.reverse();
}

export default GetReplyChain;