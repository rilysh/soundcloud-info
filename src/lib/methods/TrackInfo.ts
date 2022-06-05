import { fetchText, parseComments } from "../Util";

export default class TrackInfo {
    public async get(url: string, raw?: boolean): Promise<any> {
        const body = await fetchText(url);
        return {
            user: body.split("meta property=\"soundcloud:user\" content=\"")[1].split("\">")[0],
            id: body.split("meta property=\"al:android:url\" content=\"")[1].split("\">")[0].replace("soundcloud://sounds:", ""),
            title: body.split("meta property=\"og:title\" content=\"")[1].split("\">")[0],
            description: body.split("meta property=\"og:description\" content=\"")[1].split("\">")[0].replace("\\n", "\n").trim(),
            image: body.split("meta property=\"og:image\" content=\"")[1].split("\">")[0],
            playCount: body.split("meta property=\"soundcloud:play_count\" content=\"")[1].split("\">")[0],
            downloadCount: body.split("meta property=\"soundcloud:download_count\" content=\"")[1].split("\">")[0],
            commentsCount: body.split("meta property=\"soundcloud:comments_count\" content=\"")[1].split("\">")[0],
            likeCount: body.split("meta property=\"soundcloud:like_count\" content=\"")[1].split("\">")[0],
            genre: body.split(",\"genre\":\"")[1] && body.split(",\"genre\":\"")[1].split(",")[0].replace("\"", ""),
            author: {
                name: body.split("<h1 itemprop=\"name\"><a itemprop=\"url\"")[1].split("by <a")[1].split(">")[1].replace("</a", ""),
                username: body.split("meta property=\"soundcloud:user\" content=\"")[1].split("\">")[0].split("https://soundcloud.com/")[1],
                avatarURL: body.split("avatar_url\":")[1].split("\"")[1],
                createdAt: body.split("created_at\":")[1].split("\"")[1],
                createdAtF: new Date(body.split("created_at\":")[1].split("\"")[1]).toUTCString(),
                followersCount: body.split("followers_count\":")[1].split("\"")[0].split(",")[0],
                followingsCount: body.split("followings_count\":")[1].split("\"")[0].split(",")[0],
                groupsCount: body.split("groups_count\":")[1].split("\"")[0].split(",")[0] || null,
                firstName: body.split("first_name\":")[1].split("\"")[1] || null,
                lastName: body.split("last_name\":")[1].split("\"")[1] || null,
                fullName: body.split("full_name\":")[1].split("\"")[1] || null,
                lastModified: body.split("last_modified\":")[1].split("\"")[1] || null,
                lastModifiedF: new Date(body.split("last_modified\":")[1].split("\"")[1]).toUTCString() || null,
                likesCount: body.split("likes_count\":")[1].split("\"")[0].split(",")[0] || null,
                urn: body.split("urn\":")[1].split("\"")[1] || null,
                verified: body.split("badges\":")[1].split("\"")[6].replace(/:|}|,/g, "") === "true",
            },
            publishedAt: body.split("<time pubdate>")[1].split("<")[0],
            publishedAtF: new Date(body.split("<time pubdate>")[1].split("<")[0]).toUTCString(),
            comments: parseComments(body.split("<section class=\"comments\">")[1]),
            json: raw ? body.split("window.__sc_hydration = ")[1].split(";")[0] : "empty?!",
        };
    }
}
