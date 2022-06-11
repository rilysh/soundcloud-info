import { load } from "cheerio";
import { SOUNDCLOUD_URL } from "../gate/Constants";
import { fetchText, parseDuration, utcDate } from "../gate/Util";
import type { UserData } from "../types/userdata";
import type { UserTypes } from "../types/usertypes";

export default class UserInfo {
    public async get(username: string): Promise<UserTypes> {
        const body = await fetchText(`${SOUNDCLOUD_URL}/${username}`);
        const json = JSON.parse(`[{${body.split("{\"hydratable\":\"user\",")[1].split(";</script>")[0]}`);
        const meta = json[0].data;
        const filter = body.split("<section>")[1].split("</section>")[0];
        const $ = load(filter);
        const tracks = [] as UserData[];

        $("article").each((e) => {
            const href = $("a[itemprop=\"url\"]").eq(e);
            tracks.push({
                title: href.text(),
                url: `${SOUNDCLOUD_URL}${href.attr("href")}`,
                publishedAt: $("time").eq(e).text(),
                publishedAtF: new Date($("time").eq(e).text()).toUTCString(),
                genre: $("meta[itemprop=\"genre\"]").eq(e).attr("content") || null,
                duration: parseDuration($("meta[itemprop=\"duration\"]").eq(e).attr("content")!),
            });
        });

        const dataStruct = {
            id: meta.id,
            username: meta.username,
            avatarURL: meta.avatar_url || null,
            url: `${SOUNDCLOUD_URL}${meta.url}`,
            reatedAt: meta.created_at === "Invalid Date" ? null : meta.created_at,
            createdAtF: utcDate(meta.created_at) === "Invalid Date" ? null : utcDate(meta.created_at),
            followersCount: meta.followers_count || 0,
            followingsCount: meta.followings_count || 0,
            groupsCount: meta.groups_count || 0,
            firstName: meta.first_name || null,
            lastName: meta.last_name || null,
            fullName: meta.full_name || null,
            lastModified: meta.last_modified,
            lastModifiedF: utcDate(meta.last_modified) === "Invalid Date" ? null : utcDate(meta.last_modified),
            likesCount: meta.likes_count || 0,
            urn: meta.urn,
            verified: meta.verified,
        };
        return { dataStruct, tracks };
    }
}
