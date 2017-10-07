export interface IOrder {
    $key?: string;

    patronId: string;
    name: string;
    cost: number;
    createdAt: string;

    progress: number;
}
export class Order implements IOrder {
    patronId: string;
    name: string;
    cost: number;
    createdAt: string;

    progress: number;
}

export interface ITap {
    isPouring: boolean;
    fillPercentage: number;
}

export interface IUser {
    $key?: string; // user-id
    id: string; // The id of the user.
    name: string; // The display name of the user.
    email: string; // Email address of the user.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long user has been away
}
export class User implements IUser {
    id: string; // The id of the user.
    name: string; // The display name of the user.
    email: string; // Email address of the user.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long user has been away
}
