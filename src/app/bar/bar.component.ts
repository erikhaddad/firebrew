import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {IOrder, IUser} from '../common/data-model';
import {Observable} from 'rxjs/Observable';

export interface Item {
    name: string;
    price: number;
}

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

    orderCollection: AngularFirestoreCollection<IOrder>;
    orders: Observable<IOrder[]>;

    pouringLiquid: HTMLElement;
    isPouring: boolean;
    isLoaded: boolean;
    pouringHeight: number;
    mugLiquidHeight: number;

    constructor(private afs: AngularFirestore) {
        this.isLoaded = false;
        this.isPouring = false;
        this.pouringHeight = 0;
        this.mugLiquidHeight = 0;

        this.orderCollection = this.afs.collection<IOrder>('orders');
        this.orders = this.orderCollection.valueChanges(); // unwrapped snapshots
    }

    ngOnInit() {
        this.pouringLiquid = document.getElementById('beer-pouring-from-tap');
        this.isPouring = false;
        this.isLoaded = true;

        this.render();
    }

    private liquidAnimation (el, speed) {
        const liquidBackgroundPositionArr = getComputedStyle(el)
            .getPropertyValue('background-position')
            .split(' ');

        const liquidBackgroudPosition = parseFloat(liquidBackgroundPositionArr[1]);
        if (liquidBackgroudPosition > 0) {
            el.style.backgroundPosition = '50% ' + ((liquidBackgroudPosition - speed) + '%');
            el.style.msBackgroundPositionY = (liquidBackgroudPosition - speed) + '%';
        } else {
            el.style.backgroundPosition = '50% ' + '100%';
            el.style.msBackgroundPositionY = '100%';
        }
    }

    render () {
        if (this.isPouring) {
            this.liquidAnimation(this.pouringLiquid, 0.5);
        }
        requestAnimationFrame(this.render.bind(this));
    }

    toggleIsPouring () {
        this.isPouring = !this.isPouring;
    }

    addOrder() {
        const order = {
            patronId: '123',
            name: 'Erik Haddad',
            cost: 6,
            createdAt: '2017-10-11T00:00:00Z',
            progress: 0
        };

        // must adhere to type Order
        this.orderCollection.add(order);
    }
}
