import { Config as CoreConfig } from 'tenoxui';
export interface Config extends CoreConfig {
    apply: Record<string, string>;
    watch: boolean;
    debounceDelay: number;
    processExisting: boolean;
    selector: string;
    styleId: string;
}
export interface StatusInfo {
    processedClasses: [number, string[]];
    validClasses: [number, string[]];
    isObserving: boolean;
    isInitialized: boolean;
    styleElementExists: boolean;
}
export type MutationCallback = () => void;
