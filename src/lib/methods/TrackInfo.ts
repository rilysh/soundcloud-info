import { fetchText, parseComments, utcDate } from "../gate/Util";
import type { Track } from "../types/track";

export default class TrackInfo {
    public async get(url: string, rawJSON?: boolean): Promise<Track> {
        const body = await fetchText(url);
        const json = JSON.parse(`[{${body.split("{\"hydratable\":\"user\",")[1].split(";</script>")[0]}`);
        const meta = json[1];
        return {
            id: meta.data.id,
            title: body.split("meta property=\"og:title\" content=\"")[1].split("\">")[0],
            description: meta.data.description.trim() || null,
            image: meta.data.avatar_url || null,
            duration: meta.data.duration,
            playCount: meta.data.playback_count,
            downloadCount: meta.data.download_count,
            commentCount: meta.data.comment_count,
            likesCount: meta.data.likes_count,
            genre: meta.data.genre || null,
            purchaseURL: meta.data.purchase_url || null,
            tags: meta.data.tag_list,

            author: {
                id: meta.data.user_id,
                name: body.split("<h1 itemprop=\"name\"><a itemprop=\"url\"")[1].split("by <a")[1].split(">")[1].replace("</a", ""),
                username: meta.data.permalink || null,
                avatarURL: meta.data.user.avatar_url || null,
                createdAt: meta.data.user.created_at === "Invalid Date" ? null : meta.data.created_at,
                createdAtF: utcDate(meta.data.user.created_at) === "Invalid Date" ? null : utcDate(meta.data.created_at),
                followersCount: meta.data.user.followers_count,
                followingsCount: meta.data.user.followings_count,
                groupsCount: meta.data.user.groups_count,
                firstName: meta.data.user.first_name || null,
                lastName: meta.data.user.last_name || null,
                fullName: meta.data.user.full_name || null,
                lastModified: meta.data.user.last_modified,
                lastModifiedF: utcDate(meta.data.user.last_modified) === "Invalid Date" ? null : utcDate(meta.data.last_modified),
                likesCount: meta.data.user.likes_count,
                urn: meta.data.user.urn,
                verified: meta.data.user.badges.verified,
            },
            publisher: meta.data.publisher_metadata.publisher || null,
            publishedAt: body.split("<time pubdate>")[1].split("<")[0],
            publishedAtF: new Date(body.split("<time pubdate>")[1].split("<")[0]).toUTCString(),
            media: [
                {
                    preset: meta.data.media.transcodings[0].preset || null,
                    protocol: meta.data.media.transcodings[0].format.protocol || null,
                    url: meta.data.media.transcodings[0].url || null,
                },
                {
                    preset: meta.data.media.transcodings[1].preset || null,
                    protocol: meta.data.media.transcodings[1].format.protocol || null,
                    url: meta.data.media.transcodings[1].url || null,
                },
                {
                    preset: meta.data.media.transcodings[2].preset || null,
                    protocol: meta.data.media.transcodings[2].format.protocol || null,
                    url: meta.data.media.transcodings[2].url || null,
                },
            ],
            comments: parseComments(body.split("<section class=\"comments\">")[1]) || [],
            json: rawJSON ? body.split("window.__sc_hydration = ")[1].split(";</script>")[0] : undefined,
        };
    }
}
