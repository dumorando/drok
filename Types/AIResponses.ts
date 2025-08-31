import type { DrokMode, Model } from "./Model";

export interface AIResponse {
    mode: DrokMode,
    model: Model,
    reasoning_output?: string,
    output: string
}