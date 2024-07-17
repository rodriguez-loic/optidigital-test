window.apstag.init({
    pubID: '3689',
    adServer: 'googletag',
    simplerGPT: true,
    bidTimeout: 2000
});

let adblock_sizes = [
    [300, 250],
    [300, 600]
];

let adblock_2_sizes = [
    [300, 250],
    [300, 600]
];

let adblock_banner_sizes = [
    [728, 90],
    [750, 200]
];

let PREBID_TIMEOUT = 1000;
let FAILSAFE_TIMEOUT = 3000;

// https://docs.prebid.org/dev-docs/adunit-reference.html#ad-unit-reference
let adUnits = [
    {
        code: '/19968336/header-bid-tag-0',
        mediaTypes: {
            banner: {
                sizes: adblock_sizes
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        },{
            bidder: "nobid",
            params: {
                siteId: 2
            }
        }]
    },
    {
        code: '/19968336/header-bid-tag-2',
        // https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes
        mediaTypes: {
            banner: {
                sizes: adblock_banner_sizes
            }
        },
        // https://docs.prebid.org/dev-docs/bidders/appnexus.html
        bids: [{
            bidder: 'appnexus',
            params: {
                // https://docs.prebid.org/dev-docs/bidders/appnexus.html#bid-params
                placementId: 13144370
            }
        }, {
            bidder: 'onetag',
            params: {
                pubId: '386276e072'
            }
        }]
    },
];

let adSlots = [{
    slotID: 'adblock_2',
    slotName: '/19968336/header-bid-tag-1',
    sizes: adblock_2_sizes
},{
    slotID: 'adblock_banner',
    slotName: '/19968336/header-bid-tag-2',
    sizes: adblock_banner_sizes
}];

// Delay the ad server call so key-values can be set
var googletag = window.googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});


// https://docs.prebid.org/dev-docs/modules/dfp_express.html#prepare-the-adunit-configuration
var pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];


// Explanation:
// https://www.monetizemore.com/blog/how-integrate-a9-prebid-google-ad-manager/
// Source:
// https://stackoverflow.com/questions/61389947/amazon-in-parallel-with-prebid-using-simplergpt-and-refresh
function executeParallelAuctionAlongsidePrebid() {

    var FAILSAFE_TIMEOUT = 2000;
    var requestManager = {
        adserverRequestSent: false,
        aps: false,
        prebid: false
    };

    // when both APS and Prebid have returned, initiate ad request
    function biddersBack() {
        if (requestManager.aps && requestManager.prebid) {
            sendAdserverRequest();
        }
        return;
    }

    // sends adserver request
    function sendAdserverRequest() {
        if (requestManager.adserverRequestSent === true) {
            return;
        }
        requestManager.adserverRequestSent = true;
        googletag.cmd.push(function() {
            googletag.pubads().refresh();
        });
    }

    // Callback function for prebid.requestBids::bidsBackHandler parameter
    function initAdserver(bids, timedOut, auctionId) {
        // Avoid redundancy
        if (pbjs.initAdserverSet) return;
        pbjs.initAdserverSet = true;

        //
        googletag.cmd.push(function() {
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync();
                requestManager.prebid = true; // signals that Prebid request has completed
                biddersBack(); // checks whether both APS and Prebid have returned
            });
        });
    }

    // sends bid request to APS and Prebid
    function requestHeaderBids() {

        // APS request
        apstag.fetchBids({
            slots: adSlots
        }, function(bids) {
            googletag.cmd.push(function() {
                apstag.setDisplayBids();
                requestManager.aps = true; // signals that APS request has completed
                biddersBack(); // checks whether both APS and Prebid have returned
            });
        });

        // put prebid request here
        pbjs.que.push(function() {
            let allowActivitiesComponents = ['appnexus', 'onetag', 'nobid'];
            pbjs.setConfig({
                allowActivities: {
                    transmitTid: {
                        default: false,
                        rules: [{
                            condition(params) {
                                return allowActivitiesComponents.indexOf(params.componentName) >= 0;
                            },
                            allow: true
                        }]
                    },
                    storageAllowed: {
                        default: false,
                        rules: [{
                            condition(params) {
                                return allowActivitiesComponents.indexOf(params.componentName) >= 0;
                            },
                            allow: true
                        }]
                    }
                },
                consentManagement: {
                    gdpr: {
                        cmpApi: 'iab',
                        timeout: 9000,
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
            // Takes one ad unit object or an array of ad unit objects and adds them to the Prebid auction.
            pbjs.addAdUnits(adUnits);
            pbjs.bidderSettings = {
                appnexus: {
                    storageAllowed: true,
                    adserverTargeting: [
                        {
                            key: "apn_pbMg",
                            val: function(bidResponse) {
                                return bidResponse.pbMg;
                            }
                        }, {
                            key: "apn_adId",
                            val: function(bidResponse) {
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

            pbjs.requestBids({
                bidsBackHandler: initAdserver,
                // Timeout for requesting the bids specified in milliseconds
                timeout: PREBID_TIMEOUT
            });
        });
    }

    // initiate bid request
    requestHeaderBids();

    // set failsafe timeout
    window.setTimeout(function() {
        sendAdserverRequest();
    }, FAILSAFE_TIMEOUT);
}

executeParallelAuctionAlongsidePrebid();

// https://developers.google.com/publisher-tag/reference?hl=fr#googletag
googletag.cmd.push(function() {
    googletag.pubads().collapseEmptyDivs();

    googletag
        .defineSlot('/19968336/header-bid-tag-0', adblock_sizes, 'adblock')
        .addService(googletag.pubads());
    googletag
        .defineSlot('/19968336/header-bid-tag-1', adblock_2_sizes, 'adblock_2')
        .addService(googletag.pubads());
    googletag
        .defineSlot('/19968336/header-bid-tag-2', adblock_banner_sizes, 'adblock_banner')
        .addService(googletag.pubads());

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
