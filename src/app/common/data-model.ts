export interface IOrder {
    $key?: string;

    name: string;
    cost: number;
    createdAt: string;
}
export class Order implements IOrder {
    name: string;
    cost: number;
    createdAt: string;
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
