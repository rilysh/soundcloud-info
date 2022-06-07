import { utcDate } from "../gate/Util";
import type { TrackData } from "../types/trackdata";

export default class Track {
    public id: number;

    public title: string;

    public description: string | null;

    public image: string | null;

    public duration: number;

    public playCount: number | 0;

    public downloadCount: number | 0;

    public commentCount: number | 0;

    public likesCount: number | 0;

    public genre: string | null;

    public purchaseURL: string | null;

    public tags: string | string[] | null;

    public author: {
        id: number;
        username: string;
        avatarURL: string | null;
        createdAt: string;
        createdAtF: string | null;
        followersCount: number | 0;
        followingsCount: number | 0;
        groupsCount: number | 0;
        firstName: string | null;
        lastName: string | null;
        fullName: string | null;
        lastModified: string;
        lastModifiedF: string | null;
        likesCount: number | 0;
        urn: string;
        verified: boolean;
    };

    public media: {
        preset: string | null;
        protocol: string | null;
        url: string | null;
    }[];

    constructor(data: TrackData) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description || null;
        this.image = data.avatar_url || null;
        this.duration = data.duration;
        this.playCount = data.playback_count || 0;
        this.downloadCount = data.download_count || 0;
        this.commentCount = data.comment_count || 0;
        this.likesCount = data.likes_count || 0;
        this.genre = data.genre || null;
        this.purchaseURL = data.purchase_url || null;
        this.tags = data.tag_list || null;
        this.author = {
                id: data.user_id,
                username: data.user.username,
                avatarURL: data.user.avatar_url || null,
                createdAt: data.created_at,
                createdAtF: utcDate(data.user.created_at) === "Invalid Date" ? null : utcDate(data.created_at),
                followersCount: data.user.followers_count || 0,
                followingsCount: data.user.followings_count || 0,
                groupsCount: data.user.groups_count || 0,
                firstName: data.user.first_name || null,
                lastName: data.user.last_name || null,
                fullName: data.user.full_name || null,
                lastModified: data.user.last_modified,
                lastModifiedF: utcDate(data.user.last_modified) === "Invalid Date" ? null : utcDate(data.user.last_modified),
                likesCount: data.user.likes_count || 0,
                urn: data.user.urn,
                verified: data.user.badges.verified,
        };
        this.media = [
            {
                preset: data.media.transcodings[0].preset || null,
                protocol: data.media.transcodings[0].format.protocol || null,
                url: data.media.transcodings[0].url || null,
            },
            {
                preset: data.media.transcodings[1].preset || null,
                protocol: data.media.transcodings[1].format.protocol || null,
                url: data.media.transcodings[1].url || null,
            },
        ];
    }
}
