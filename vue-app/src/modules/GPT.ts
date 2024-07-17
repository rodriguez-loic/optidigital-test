import GeneralSize = googletag.GeneralSize;
import MultiSize = googletag.MultiSize;
import SingleSize = googletag.SingleSize;
import Prebid from "./Prebid.ts";

class GPT {
    isRequestSent: Boolean = false;

    constructor() {
        window.googletag = window.googletag || { cmd: [] };
    }

    disableInitialLoad() {
        googletag.cmd.push(function () {
            googletag.pubads().disableInitialLoad();
        });
    }

    setSlots(ad_sizes: any) {
        // https://developers.google.com/publisher-tag/reference?hl=fr#googletag
        googletag.cmd.push(() => {
            googletag.pubads().collapseEmptyDivs();

            // @ts-ignore
            googletag
                .defineSlot('/19968336/header-bid-tag-0', this.getSizes('mixed', ad_sizes), 'adblock')
                .addService(googletag.pubads());
            // @ts-ignore
            googletag
                .defineSlot('/19968336/header-bid-tag-1', this.getSizes('mixed', ad_sizes), 'adblock_2')
                .addService(googletag.pubads());
            // @ts-ignore
            googletag
                .defineSlot('banner-space', this.getSizes('horizontal', ad_sizes), 'adblock_banner')
                .addService(googletag.pubads());

            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });
    }

    setTargetingForGPTAsync(prebid: Prebid) {
        googletag.cmd.push(() => {
            pbjs.que.push(() => {
                pbjs.setTargetingForGPTAsync();
                prebid.isRequestSent = true; // signals that Prebid request has completed
            });
        });
    }

    refresh() {
        googletag.cmd.push(function() {
            googletag.pubads().refresh();
        });
    }

    getSizes(id: string, ad_sizes: any): GeneralSize|MultiSize|SingleSize|['fluid'] {
        return ad_sizes[id];
    }
}

export default GPT;
