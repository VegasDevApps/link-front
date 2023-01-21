
export type FriendRequest_Status = 'not-sent' | 'pending' | 'accept' | 'declined' | 'waiting-for-current-user-response';

export enum FriendRequest_Statuses {
    notSent = 'not-sent',
    pending = 'pending',
    accept = 'accept',
    declined = 'declined',
    waitingForCurrentUserResponse = 'waiting-for-current-user-response'
}

export interface FriendRequestStatus {
    status?: FriendRequest_Status
}

export interface FriendRequest {
    id: number;
    creatorId: number;
    receiverId: number;
    status?: FriendRequest_Status;
}