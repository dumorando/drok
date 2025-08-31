import type { DrokMode } from "../Types/Model";

export function GetModeFriendlyName(mode: DrokMode) {
    const names = [":zap: Drok Fast", ":art: Drok Creative", ":brain: Drok Expert"]
    
    return names[mode];
}