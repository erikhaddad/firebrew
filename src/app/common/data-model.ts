export enum OrderStatus {
    PENDING = 1,
    ORDERED = 2,
    PROCESSING = 3,
    COMPLETED = 4,
    CANCELLED = 5,
    DECLINED = 6,
    INCOMPLETE = 7,
    PREORDERED = 8,
    QUOTED = 9,
}

export interface IBarState {
    pouring: boolean;

    alpha: number;
    beta: number;
    gamma: number;
}

export interface IOrder {
    $key?: string;

    patronId: string;
    name: string;
    avatar: string;
    createdAt: any;

    cost: number;
    status: number;
    progress: number;
}
export class Order implements IOrder {
    patronId: string;
    name: string;
    avatar: string;
    createdAt: any;

    cost: number;
    status: number;
    progress: number;
}

export interface IPatron {
    $key?: string; // patron-id
    id: string; // The id of the patron.
    name: string; // The display name of the patron.
    email: string; // Email address of the patron.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long patron has been away
}
export class Patron implements IPatron {
    id: string; // The id of the patron.
    name: string; // The display name of the patron.
    email: string; // Email address of the patron.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long patron has been away
}
