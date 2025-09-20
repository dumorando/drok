# drok
An AI discord bot, similar to twitters grok.<br>

[try it on my discord server!](https://dumo.lol/discord)

The code is also verry messy, considering this is basically my first typescript project, and also my first AI-sdk project.<br>

# Screenshots
<img width="1236" height="220" alt="image" src="https://github.com/user-attachments/assets/d27e8822-ef5a-4bcd-ae99-b480d6cc91b8" />

# Modes
The messages are routed to the best mode available using Llama 4 Scout free on openrouter.
- Expert (uses deepseek-reasoner with temperature 0, is amazing for math/programming)
- Creative (uses deepseek-chat with a high temperature, is good for... creative)
- Fast (uses deepseek-chat, fallback/default)


# Allowed forms of input
- DMs
- Regular messages containing a mention to @Drok
- Replies containing a mention to @Drok

# Installation
Please note that this project probably will never explicitly support node, as bun is my runtime of choice.<br>
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
