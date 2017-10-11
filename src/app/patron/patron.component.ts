import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {IMugState, IOrder, IPatron, ITapState, Order, OrderStatus} from '../common/data-model';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-patron',
    templateUrl: './patron.component.html',
    styleUrls: ['./patron.component.scss']
})
export class PatronComponent implements OnInit {

    paramSubscription: any;
    patronId: string;
    patron$: AngularFirestoreDocument<IPatron>;
    patron: IPatron;

    isLoaded: boolean;
    isClicked: boolean;

    ordersCollection: AngularFirestoreCollection<IOrder>;
    orders$: Observable<IOrder[]>;

    patronOrdersCollection: AngularFirestoreCollection<IOrder>;
    patronOrders$: Observable<IOrder[]>;
    patronCurrentOrder: IOrder;

    stateOfOrder$: AngularFirestoreDocument<IOrder>;
    currentOrder: IOrder;

    stateOfTap$: AngularFirestoreDocument<ITapState>;
    tapState: ITapState;

    stateOfMug$: AngularFirestoreDocument<IMugState>;
    mugState: IMugState;

    completedOrderIds: string[];
    queuedOrderIds: string[];
    patronCompletedOrderIds: string[];
    patronQueuedOrderIds: string[];

    beerCost = 6;
    x0 = 0;
    y0 = 0;
    ax = 0;
    ay = 0;
    az = 0;
    laggedAX = 0;
    laggedAY = 0;
    platform = 'desktop';

    constructor(public dataService: DataService,
                public authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
        this.isLoaded = false;
        this.isClicked = false;

        this.completedOrderIds = [];
        this.currentOrder = null;
        this.queuedOrderIds = [];

        this.patronCompletedOrderIds = [];
        this.patronCurrentOrder = null;
        this.patronQueuedOrderIds = [];

        this.ordersCollection = dataService.orders;
        this.orders$ = this.ordersCollection.valueChanges();

        this.orders$
            .subscribe((orders: IOrder[]) => {
                orders.map((order: IOrder, index: number) => {
                    if (order.status === OrderStatus.ORDERED) {
                        this.queuedOrderIds.push(order.id);
                    } else if (order.status === OrderStatus.COMPLETED) {
                        this.completedOrderIds.push(order.id);
                    }
                });
            });

        this.stateOfOrder$ = this.dataService.stateOfOrder;
        this.stateOfOrder$.valueChanges().subscribe(order => {
            this.currentOrder = order;
        });

        this.stateOfTap$ = this.dataService.stateOfTap;
        this.stateOfTap$.valueChanges().subscribe(tap => {
            this.tapState = tap;
        });

        this.stateOfMug$ = this.dataService.stateOfMug;
        this.stateOfMug$.valueChanges().subscribe(mug => {
            this.mugState = mug;
        });
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.patronId = params['patronId'];

            this.patron$ = this.dataService.getPatron(this.patronId);
            this.patron$.valueChanges().subscribe(patron => {
                if (patron) {
                    this.patron = patron;

                    this.patronOrdersCollection = this.dataService.getOrdersByPatron(this.patronId);
                    this.patronOrders$ = this.ordersCollection.valueChanges();

                    this.patronOrders$
                        .subscribe((orders: IOrder[]) => {
                            orders.map((order: IOrder, index: number) => {
                                if (order.status === OrderStatus.ORDERED) {
                                    this.patronQueuedOrderIds.push(order.id);
                                } else if (order.status === OrderStatus.COMPLETED) {
                                    this.patronCompletedOrderIds.push(order.id);
                                }
                            });
                        });
                } else {
                    this.router.navigate(['/']);
                }
            });
        });

        this.isLoaded = true;
    }

    private getMobileOS() {
        const e = navigator.userAgent || navigator.vendor || window['opera'];

        return e.match(/iPad/i) || e.match(/iPhone/i) || e.match(/iPod/i) ? 'iOS' : e.match(/Android/i) ? 'Android' : 'unknown';
    }

    private iOSversion() {
        const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
    }

    onDeviceMotion(evt) {
        if (this.getMobileOS() === 'iOS') {
            this.ax = evt.accelerationIncludingGravity.x;
            this.ay = evt.accelerationIncludingGravity.y;
            this.az = evt.accelerationIncludingGravity.z;
        } else {
            this.ax = -evt.accelerationIncludingGravity.x;
            this.ay = -evt.accelerationIncludingGravity.y;
            this.az = evt.accelerationIncludingGravity.z;
        }
        const n = evt.rotationRate;
        let alpha = 0;
        let beta = 0;
        let gamma = 0;

        if (n != null) {
            alpha = Math.round(n.alpha);
            beta = Math.round(n.beta);
            gamma = Math.round(n.gamma);
        }

        const s = {
            messageName: 'DeviceOrientationUpdate',
            ax: this.ax,
            ay: this.ay,
            az: this.az,
            arAlpha: alpha,
            arBeta: beta,
            arGamma: gamma
        };
    }

    createOrder() {
        const order = new Order();

        order.patronId = this.patron.id;
        order.name = this.patron.name;
        order.avatar = this.patron.avatar;

        order.cost = this.beerCost;
        order.status = OrderStatus.PENDING;

        const response = this.dataService.createOrder(order);
        console.log('add response', response);
    }
}
