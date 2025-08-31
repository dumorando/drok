import { z } from 'zod';
//import { evaluate } from 'mathjs';
import { tool } from 'ai';

interface ExaResponse {
    results: ExaResult[];
}

interface ExaResult {
    title: string;
    summary: string;
    url: string;
}

interface ToolUse {
    type: string;
    equation?: string;
    query?: string;
}

const toolparent = () => {
    let toolusage: ToolUse[] = [];
    return {
        tools: {
            search: tool({
                description: 'Search the web for information',
                inputSchema: z.object({
                    query: z.string().describe("The query to search for")
                }),
                execute: async ({ query }) => {
                    toolusage.push({type:'search',query});
                    try {
                        const results = await fetch("https://api.exa.ai/search", {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                                'X-api-key': process.env.EXA_API_KEY as string
                            },
                            body: JSON.stringify({
                                query,
                                text: true
                            }),
                        });
                        const actualresults: ExaResponse = (await results.json()) as ExaResponse;

                        // console.log(actualresults);
                        return actualresults.results.map(result => {
                            return {
                                title: result.title,
                                summary: result.summary,
                                url: result.url
                            }
                        });
                    } catch (error) {
                        return "error";
                    }
                }
            })
        },
        getToolUsage: () => {return toolusage}
    }
}

export default toolparent;