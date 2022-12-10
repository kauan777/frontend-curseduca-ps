export interface FriendProps{
    id: string,
    senderId: string,
    recipientId: string,
    friend: {
        id: string,
        name: string,
        imagePath: string
    }
}