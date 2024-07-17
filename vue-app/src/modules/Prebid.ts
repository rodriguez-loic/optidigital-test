import type { AdUnit } from 'AdUnit';
import GeneralSize = googletag.GeneralSize;
import MultiSize = googletag.MultiSize;
import SingleSize = googletag.SingleSize;

class Prebid {
    ad_units: AdUnit[] = []
    bid_timeout = 1000;
    failsafe_timeout = 3000;
    isRequestSent: Boolean = false;

    constructor() {
        // https://docs.prebid.org/dev-docs/modules/dfp_express.html#prepare-the-adunit-configuration
        window.pbjs = window.pbjs || { que: [] };
    }

    init(ad_sizes: any) {
        this.addAdUnit( {
            code: '/19968336/header-bid-tag-0',
            // https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes
            mediaTypes: {
                banner: {
                    sizes: this.getSizes('mixed', ad_sizes)
                }
            },
            bids: [{
                // https://docs.prebid.org/dev-docs/bidders/appnexus.html
                bidder: 'appnexus',
                params: {
                    // https://github.com/prebid/Prebid.js/blob/master/modules/appnexusBidAdapter.md
                    placementId: parseInt(import.meta.env.VITE_APPNEXUS_PLACEMENTID, 10)
                }
            },{
                // https://docs.prebid.org/dev-docs/bidders/nobid.html
                bidder: "nobid",
                params: {
                    // https://github.com/prebid/Prebid.js/blob/master/modules/nobidBidAdapter.md
                    siteId: parseInt(import.meta.env.VITE_NOBID_SITEID, 10)
                }
            }, {
                bidder: 'onetag',
                params: {
                    // https://github.com/prebid/Prebid.js/blob/master/modules/onetagBidAdapter.md
                    pubId: import.meta.env.VITE_ONETAG_PUBID
                }
            }]
        });

        this.addAdUnit( {
            code: 'banner-space',
            mediaTypes: {
                banner: {
                    sizes: this.getSizes('horizontal', ad_sizes)
                }
            },
            bids: [{
                bidder: 'appnexus',
                params: {
                    // https://docs.prebid.org/dev-docs/bidders/appnexus.html#bid-params
                    placementId: parseInt(import.meta.env.VITE_APPNEXUS_PLACEMENTID, 10)
                }
            }, {
                bidder: 'onetag',
                params: {
                    // https://github.com/prebid/Prebid.js/blob/master/modules/onetagBidAdapter.md
                    pubId: import.meta.env.VITE_ONETAG_PUBID
                }
            }]
        });

        if (import.meta.env.VITE_DEBUG) {
            console.log('********** Debug Ad Units *************');
            console.log(this.ad_units);
            console.log('************************************************');
        }
    }

    setConfig() {
        // put prebid request here
        pbjs.que.push(() => {
            let allowActivitiesComponents = ['appnexus', 'onetag', 'nobid'];

            pbjs.setConfig({
                allowActivities: {
                    transmitTid: {
                        default: false,
                        rules: [{
                            condition(params: any) {
                                return allowActivitiesComponents.indexOf(params.componentName) >= 0;
                            },
                            allow: true
                        }]
                    },
                    storageAllowed: {
                        default: false,
                        rules: [{
                            condition(params: any) {
                                return allowActivitiesComponents.indexOf(params.componentName) >= 0;
                            },
                            allow: true
                        }]
                    },
                },
                deviceAccess: true,
                consentManagement: {
                    gdpr: {
                        cmpApi: 'iab',
                        timeout: 10000,
                        actionTimeout: 10000,
                        defaultGdprScope: true,
                    },
                },
                userSync: {
                    topics: {
                        maxTopicCaller: 3, // SSP rotation
                    }
                }
            });

            /*
            // @ts-ignore
            window.__tcfapi('addEventListener', 2, (tcData: any, success: Boolean) => {
                if (success) {
                    if (!tcData.gdprApplies) {
                        console.log("GDPR doesn't apply to user");
                        return;
                    } else {

                        pbjs.setConfig({
                            deviceAccess: !!tcData.purpose.consents[1],
                            consentManagement: {
                                gdpr: {
                                    cmpApi: 'static',
                                    timeout: 9000,
                                    actionTimeout: 10000,
                                    defaultGdprScope: true,
                                    consentData: {
                                        getTCData: {
                                            tcString: tcData.tcString,
                                            addtlConsent: tcData.addtlConsent,
                                            gdprApplies: true,
                                            purpose: tcData.purpose,
                                            vendor: tcData.vendors
                                        }
                                    }
                                },
                            }
                        })

                        if (!!tcData.purpose.consents[1]) {
                            pbjs.setConfig({
                                userSync: {
                                    topics: {
                                        maxTopicCaller: 2, // SSP rotation
                                        bidders: [{
                                            bidder: 'appnexus',
                                            iframeURL: 'https://appnexus.com:8080/topics/fpd/topic.html', // dummy URL
                                            expiry: 7 // Configurable expiry days
                                        }]
                                    }
                                }
                            })
                        }
                    }
                }
                return;
            });
            */

            pbjs.bidderSettings = {
                appnexus: {
                    storageAllowed: true,
                    adserverTargeting: [
                        {
                            key: "apn_pbMg",
                            val: function(bidResponse: any) {
                                return bidResponse.pbMg;
                            }
                        }, {
                            key: "apn_adId",
                            val: function(bidResponse: any) {
                                return bidResponse.adId;
                            }
                        }
                    ]
                },
                onetag: {
                    storageAllowed: true
                },
                nobid: {
                    storageAllowed: true
                }
            }

            // Takes one ad unit object or an array of ad unit objects and adds them to the Prebid auction.
            pbjs.addAdUnits(this.ad_units);
        });
    }

    addAdUnit(unit: AdUnit) {
        this.ad_units.push(unit);
    }

    getSizes(id: string, ad_sizes: any): GeneralSize|MultiSize|SingleSize|['fluid'] {
        return ad_sizes[id];
    }

}

export default Prebid;
