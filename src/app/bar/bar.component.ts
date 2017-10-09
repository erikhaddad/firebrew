import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {IOrder, IPatron, OrderStatus} from '../common/data-model';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../common/data.service';
import {current} from 'codelyzer/util/syntaxKind';
import {subscribeOn} from 'rxjs/operator/subscribeOn';

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

    ordersCollection: AngularFirestoreCollection<IOrder>;
    orders$: Observable<IOrder[]>;

    completedOrderIds: string[];
    currentOrder: IOrder|null;
    queuedOrderIds: string[];

    pouringLiquid: HTMLElement;
    isPouring: boolean;
    isLoaded: boolean;
    pouringHeight: number;
    mugLiquidHeight: number;

    constructor(public dataService: DataService) {
        this.isLoaded = false;
        this.isPouring = false;
        this.pouringHeight = 0;
        this.mugLiquidHeight = 0;

        this.completedOrderIds = [];
        this.currentOrder = null;
        this.queuedOrderIds = [];

        this.ordersCollection = dataService.orders;
        this.orders$ = this.ordersCollection.valueChanges();

        this.orders$
            .subscribe((orders: IOrder[]) => {
                orders.map((order: IOrder, index: number) => {
                    if (order.status === OrderStatus.ORDERED) {
                        if (this.queuedOrderIds.length === 0) {
                            this.currentOrder = order;
                        }
                        this.queuedOrderIds.push(order.id);
                    } else if (order.status === OrderStatus.COMPLETED) {
                        this.completedOrderIds.push(order.id);
                    }

                    if (this.queuedOrderIds.length > 0) {
                        this.isPouring = true;
                    }

                    // console.log(this.currentOrder, this.queuedOrderIds, this.completedOrderIds);
                });
            });
    }

    ngOnInit() {
        this.pouringLiquid = document.getElementById('beer-pouring-from-tap');
        this.isLoaded = true;

        this.render();
    }

    private liquidAnimation(el, speed) {
        const liquidBackgroundPositionArr = getComputedStyle(el)
            .getPropertyValue('background-position')
            .split(' ');

        const liquidBackgroudPosition = parseFloat(liquidBackgroundPositionArr[1]);
        if (liquidBackgroudPosition > 0) {
            el.style.backgroundPosition = '50% ' + ((liquidBackgroudPosition - speed) + '%');
        } else {
            el.style.backgroundPosition = '50% ' + '100%';
        }
    }

    render() {
        if (this.isPouring) {
            this.liquidAnimation(this.pouringLiquid, 0.5);
        }
        requestAnimationFrame(this.render.bind(this));
    }

    toggleIsPouring() {
        this.isPouring = !this.isPouring;
    }
}
