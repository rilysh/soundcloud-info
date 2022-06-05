import { get } from "node:https";
import type { Comment } from "./types/comment";

// https://github.com/discord-player/soundcloud-scraper/blob/eb22f1b7efe47e86d9e229d79cafb000bf374358/src/util/Util.js#L112
export function parseComments(commentSection: string): Comment[] | null {
    if (!commentSection) {
        return null;
    }
    const section = commentSection.trim().split("</time>");
    const arr = [] as Comment[];
    section.forEach((item) => {
        if (!item.includes("Comment by <a")) {
            return;
        }
        const prop = item.split("Comment by <a")[1];
        const url = prop.split("href=\"")[1].split("\">")[0].trim();
        const username = prop.split(`${url}">`)[1].split("</a>")[0].trim();
        const content = item.split("<p>")[1].split("</p>")[0].trim();
        const timestamp = item.split("<time pubdate>")[1];
        const obj = {
            text: content,
            createdAt: timestamp,
            createdAtF: new Date(timestamp).toUTCString(),
            author: {
                name: username,
                username: url.replace("/", ""),
                url: `https://soundcloud.com${url}`,
            },
        } as Comment;
        arr.push(obj);
    });
    return arr;
}

export async function fetchText(url: string): Promise<any> {
    // eslint-disable-next-line arrow-body-style
    return new Promise((res, rej) => {
        // eslint-disable-next-line no-promise-executor-return
        return get(url, (got) => {
            let data = "";
            got.on("data", (chunk) => {
                data += chunk;
            });
            got.on("end", () => res(data.toString()));
            got.on("error", (err) => rej(err));
        }).on("error", (err) => rej(err));
    });
}
