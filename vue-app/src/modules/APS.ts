import {AdSlot} from "AdSlot";

class APS {
    isRequestSent: Boolean = false;
    adSlots: AdSlot[] = [];
    failsafe_timeout: Number = 2000;

    constructor() {
        window.apstag.init({
            pubID: import.meta.env.VITE_AMAZON_PUBID,
            adServer: 'googletag',
            simplerGPT: true,
            bidTimeout: 2000
        });
    }

    addAdSlot(adSlot:AdSlot): void {
        this.adSlots.push(adSlot);
    }

    fetchBid() {
        // APS request
        window.apstag.fetchBids({
            slots: this.adSlots,
            timeout: this.failsafe_timeout
        },(bids) => {
            if (import.meta.env.VITE_DEBUG) {
                console.log('********** Debug APS Fetch Bids *************');
                console.log(bids);
                console.log('************************************************');
            }
            googletag.cmd.push(()=> {
                apstag.setDisplayBids();
                this.isRequestSent = true;
            });
        });
    }
}

export default APS;
