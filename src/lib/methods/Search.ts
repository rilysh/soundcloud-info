import { load } from "cheerio";
import { fetchText } from "../gate/Util";
import { SOUNDCLOUD_URL } from "../gate/Constants";
import type { SearchData } from "../types/searchdata";

export default class SCSearch {
    public async get(query: string, endpoint: string = "all") {
        if (!query) {
            throw new RangeError("You need to provide a query to search.");
        }
        if (typeof query !== "string") {
            throw new TypeError("Query must be a string.");
        }

        let searchType;

        switch (endpoint) {
            case "track":
                searchType = "/search/sounds?q=";
                break;

            case "artist":
                searchType = "/search/people?q=";
                break;

            case "playlist":
                searchType = "/search/sets?q=";
                break;

            case "all":
                searchType = "/search?q=";
                break;

            default:
                throw new RangeError("An unknwon parameter was supplied.");
        }

        const body = await fetchText(`${SOUNDCLOUD_URL}${searchType}${encodeURIComponent(query)}`);
        const meta = body.split("<noscript><ul>")[1].split("</ul>")[1].split("</noscript>")[0];
        const $ = load(meta);
        const dataArr = [] as SearchData[];
        if ($("li").length === 0) {
            throw new RangeError("No results found about your query.");
        }

        $("li").each((e) => {
            /**
             * Filter "li" from the web page, as we need "href" attribute which contains
             * The info about the search results
             */
            const attr = $("a").eq(e).attr("href");
            const fl = attr?.split("/").filter((x) => !!x);
            let mtype;

            switch (fl?.length) {
                case 1:
                    mtype = "artist";
                    break;

                case 2:
                    mtype = "track";
                    break;

                case 3:
                    if (fl.includes("sets")) {
                        mtype = "playlist";
                    } else {
                        mtype = "unknown";
                    }
                    break;

                default:
                    mtype = "unknown";
                    break;
            }

            dataArr.push({
                index: e,
                name: $("a").eq(e).text(),
                artist: fl![0] || null,
                url: `${SOUNDCLOUD_URL}${attr}`,
                type: mtype,
            });
        });
        return dataArr;
    }
}
