export interface Comment {
    text: string,
    createdAt: string,
    createdAtF: string,
    author: {
        name: string,
        username: string,
        url: string,
    }
}
