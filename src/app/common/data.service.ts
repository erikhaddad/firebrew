import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AuthService} from '../auth/auth.service';
import {IUser, User, Order, IOrder} from './data-model';


@Injectable()
export class DataService {
    private queuePath: string;
    private userOrdersPath: string;
    private usersPath: string;

    constructor(private afs: AngularFirestore, private auth: AuthService) {
        this.queuePath = '/queue';
        this.usersPath = '/users';
        this.userOrdersPath = '/user-orders';
    }

    get users(): AngularFirestoreCollection<IUser[]> {
        return this.afs.collection(this.usersPath);
    }

    get userOrders(): AngularFirestoreCollection<IOrder[]> {
        return this.afs.collection(this.userOrdersPath);
    }

    get queue(): AngularFirestoreCollection<IOrder[]> {
        return this.afs.collection(this.queuePath);
    }

    getUserOrders(id: string): AngularFirestoreDocument<IOrder[]> {
        return this.afs.doc(`${this.userOrdersPath}/${id}`);
    }

    /** USERS **/
    createUser(user: User): Promise<any> {
        return this.afs.collection(this.usersPath).add(user);
    }
    getUser(userId: string): AngularFirestoreDocument<IUser> {
        return this.afs.doc(`${this.usersPath}/${userId}`);
    }
    removeUser(user: IUser): Promise<any> {
        return this.afs.doc(`${this.usersPath}/${user.$key}`).delete();
    }
    updateUser(user: IUser): Promise<any> {
        return this.afs.doc(`${this.usersPath}/${user.$key}`).update(user);
    }

    /** ORDERS **/
    createUserOrder(userId: string, order: Order): Promise<any> {
        return this.afs.collection(`${this.userOrdersPath}/${userId}`).add(order);
    }
}
