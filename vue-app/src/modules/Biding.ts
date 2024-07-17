import _ from 'lodash';
import Prebid from './Prebid';
import APS from './APS';
import GPT from './GPT';
import GeneralSize = googletag.GeneralSize;
import MultiSize = googletag.MultiSize;
import SingleSize = googletag.SingleSize;

class Biding {

    ad_sizes: any = []
    gpt: GPT = new GPT();
    aps: APS = new APS();
    prebid: Prebid = new Prebid();
    adserverRequestSent: Boolean = false;

    constructor() {
        this.gpt.disableInitialLoad();

        this.setSizes();

        this.prebid.init(this.ad_sizes);

        this.requestHeaderBids();

        window.setTimeout(() => {
            this.sendAdserverRequest();
        }, this.prebid.failsafe_timeout);

        this.gpt.setSlots(this.ad_sizes);
    }

    addSize(id: string, sizes: GeneralSize|MultiSize|SingleSize|['fluid']) {
        this.ad_sizes[id] = sizes;
    }

    getSizes(id: string): GeneralSize|MultiSize|SingleSize|['fluid'] {
        return this.ad_sizes[id];
    }

    setSizes() {
        this.addSize('square', [300, 250]);
        this.addSize('mixed', [[300, 250], [300,600], [400, 600]]);
        this.addSize('vertical', [300, 600]);
        this.addSize('horizontal', [[728, 90],[750, 200], [735, 500]]);
    }

    biddersBack() {
        if (this.aps.isRequestSent && this.prebid.isRequestSent) {
            this.sendAdserverRequest();
        }
        return;
    }

    // Explanation:
    // https://www.monetizemore.com/blog/how-integrate-a9-prebid-google-ad-manager/
    // Source:
    // https://stackoverflow.com/questions/61389947/amazon-in-parallel-with-prebid-using-simplergpt-and-refresh
    sendAdserverRequest() {
        if (this.adserverRequestSent === true) {
            return;
        }
        this.adserverRequestSent = true;
        if (import.meta.env.VITE_DEBUG) {
            console.log('********** Send Ad Server Request *************');
        }

        this.gpt.refresh();
    }

    initAdserver(bids: Object, timedOut: Number, auctionId: String) {
        if (import.meta.env.VITE_DEBUG) {
            console.log('********** Debug PBJS Request Bids *************');
            console.log(bids);
            console.log(timedOut);
            console.log(auctionId);
            console.log('************************************************');
        }

        // Avoid redundancy
        if (pbjs.initAdserverSet) return;
        pbjs.initAdserverSet = true;

        this.gpt.setTargetingForGPTAsync(this.prebid);

        this.biddersBack();
    }

    requestHeaderBids() {

        this.aps.addAdSlot({
            slotID: '/19968336/header-bid-tag-1',
            slotName: 'adblock_2',
            sizes: this.getSizes('mixed')
        });
        this.aps.addAdSlot({
            slotID: 'banner-space',
            slotName: 'adblock_banner',
            sizes: this.getSizes('horizontal')
        });

        this.aps.fetchBid();

        this.biddersBack();

        this.prebid.setConfig();

        pbjs.que.push(() => {
            pbjs.requestBids({
                bidsBackHandler: this.initAdserver.bind(this),
                timeout: this.prebid.bid_timeout
            });
        });
    }

}

export default Biding;
