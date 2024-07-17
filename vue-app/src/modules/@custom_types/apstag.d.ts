declare namespace apstag {
    function init(config: Object): void;

    function fetchBids(slots: Object, callback: (bids: Object) => void): void

    function setDisplayBids(): void
}
