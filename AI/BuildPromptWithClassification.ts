import type { ClassifiedPromptBuilderOutput, PromptBuilderOptions } from "../Types/PromptBuilder";
import FastBuildPrompt from "./Modes/Fast/Promptbuilder";
import CreativeBuildPrompt from "./Modes/Creative/Promptbuilder";
import ExpertBuildPrompt from "./Modes/Expert/Promptbuilder";
import ClassifyPrompt from "./Classifier";
import { PromptClassification } from "../Types/Classification";
import { DrokMode } from "../Types/Model";

export default async function BuildPromptWithClassification(options: PromptBuilderOptions): Promise<ClassifiedPromptBuilderOutput> {
    const classification = await ClassifyPrompt(options.message.content);
    
    if (classification === PromptClassification.coding_math) return { built_prompt: ExpertBuildPrompt(options), mode: DrokMode.expert };
    if (classification === PromptClassification.creative) return { built_prompt: CreativeBuildPrompt(options), mode: DrokMode.creative };
    if (classification === PromptClassification.conversation) return { built_prompt: FastBuildPrompt(options), mode: DrokMode.fast };

    return { built_prompt: FastBuildPrompt(options), mode: DrokMode.fast };
}