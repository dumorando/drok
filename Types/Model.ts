export interface Model {
    friendlyName: string;
    name: string
}

export interface ModelOptions {
    reasoner: Model;
    regular: Model;
}

export enum DrokMode {
    fast,
    creative,
    expert
}