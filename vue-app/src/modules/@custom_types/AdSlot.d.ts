import GeneralSize = googletag.GeneralSize;
import MultiSize = googletag.MultiSize;
import SingleSize = googletag.SingleSize;

export interface AdSlot {
    slotID: String;
    slotName: String;
    sizes: GeneralSize|MultiSize|SingleSize|['fluid'];
}
