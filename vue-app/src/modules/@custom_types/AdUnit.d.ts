import GeneralSize = googletag.GeneralSize;
import MultiSize = googletag.MultiSize;
import SingleSize = googletag.SingleSize;

export interface AdUnit {
    code: String;
    bids?: AdUnitBid[];
    mediaTypes?: AdUnitMediaTypes;
    labelAny?: String[];
    labelAll?: String[];
    ortb2Imp?: Object;
    ttlBuffer?: Number;
    renderer?: Object;
    video?: AdUnitVideo;
    deferBilling?: Boolean;
}

export interface AdUnitBid {
    bidder?: String;
    module?: String;
    params: Object;
    labelAny?: String[];
    labelAll?: String[];
    ortb2Imp?: Object;
    renderer?: Object;
}

export interface AdUnitMediaTypes {
    banner?: AdUnitMediaTypesBanner;
    native?: Object;
    video?: AdUnitMediaTypesVideo;
}

export interface AdUnitMediaTypesBanner {
    sizes: GeneralSize|MultiSize|SingleSize|['fluid'];
    pos?: 0|1|3|4|5|6|7;
    name?: String;
}
export interface AdUnitMediaTypesVideo {
    pos?: 0|1|3|4|5|6|7;
    context?: 'instream'|'outstream'|'adpod';
    useCacheKey?: Boolean;
    placement?: 1|2|3|4|5;
    plcmt?: 1|2|3|4;
    playerSize?: Number[];
    api?: Number[];
    mimes?: String[];
    protocols?: Number[];
    playbackmethod?: Number[];
    minduration?: Number;
    maxduration?: Number;
    w?: Number;
    h?: Number;
    startDelay?: Number;
    linearity?: Number;
    skip?: Number;
    skipmin?: Number;
    skipafter?: Number;
    minbitrate?: Number;
    maxbitrate?: Number;
    delivery?: Number[];
    pos?: Number;
    playbackend?: Number;
    adPodDurationSec?: Number;
    durationRangeSec?: Number[];
    requireExactDuration?: Boolean;
    tvSeriesName?: String;
    tvEpisodeName?: String;
    tvSeasonNumber?: Number;
    tvEpisodeNumber?: Number;
    contentLengthSec?: Number;
    contentMode?: String;
}

export interface AdUnitVideo {
    divId: String;
    adServer?: AdUnitVideoAdServer;
}

export interface AdUnitVideoAdServer {
    vendorCode: String;
    baseAdTagUrl?: String;
    params?: Object;
}
