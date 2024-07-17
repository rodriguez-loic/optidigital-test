declare namespace pbjs {
    const que: Array<(this: typeof globalThis) => void> | QueArray;

    function setTargetingForGPTAsync(): void;

    function setConfig(config: Object): void

    function addAdUnits(adUnits: AdUnit[]|AdUnit): void

    function requestBids(request: Object): void

    let initAdserverSet: Boolean;

    let bidderSettings: Object;

    interface QueArray {
        push(...f: Array<(this: typeof globalThis) => void>): number;
    }
}
