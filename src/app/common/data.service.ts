import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AuthService} from '../auth/auth.service';
import {IPatron, Patron, Order, IOrder, OrderStatus} from './data-model';

@Injectable()
export class DataService {
    private ordersPath: string;
    private patronsPath: string;

    constructor(private afs: AngularFirestore, private auth: AuthService) {
        this.ordersPath = '/orders';
        this.patronsPath = '/patrons';
    }

    /** ORDERS **/
    get orders(): AngularFirestoreCollection<IOrder[]> {
        return this.afs.collection(this.ordersPath);
    }
    createOrder(order: Order): Promise<any> {
        order.status = OrderStatus.ORDERED;
        return this.afs.collection(`${this.ordersPath}`).add(order);
    }
    getOrder(id: string): AngularFirestoreDocument<IOrder> {
        return this.afs.doc(`${this.ordersPath}/${id}`);
    }
    getOrdersByPatron(patronId: string): AngularFirestoreCollection<IOrder[]> {
        return this.afs.collection('orders', ref => ref.where('patronId', '==', patronId));
    }
    getOrdersByStatus(status: number): AngularFirestoreCollection<IOrder[]> {
        return this.afs.collection('orders', ref => ref.where('status', '==', status));
    }

    /** PATRONS **/
    get patrons(): AngularFirestoreCollection<IPatron[]> {
        return this.afs.collection(this.patronsPath);
    }
    createPatron(patron: Patron): Promise<any> {
        return this.afs.collection(this.patronsPath).add(patron);
    }
    getPatron(patronId: string): AngularFirestoreDocument<IPatron> {
        return this.afs.doc(`${this.patronsPath}/${patronId}`);
    }
    removePatron(patron: IPatron): Promise<any> {
        return this.afs.doc(`${this.patronsPath}/${patron.$key}`).delete();
    }
    updatePatron(patron: IPatron): Promise<any> {
        return this.afs.doc(`${this.patronsPath}/${patron.$key}`).update(patron);
    }
}
