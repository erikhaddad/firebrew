import {ApplicationInitStatus, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {IMugState, IOrder, IPatron, ITapState, OrderStatus} from '../common/data-model';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../common/data.service';

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
    beerAudioBack: HTMLAudioElement;
    beerAudioBegin: HTMLAudioElement;

    ordersCollection: AngularFirestoreCollection<IOrder>;
    orders$: Observable<IOrder[]>;

    stateOfOrder$: AngularFirestoreDocument<IOrder>;
    currentOrder: IOrder;

    stateOfTap$: AngularFirestoreDocument<ITapState>;
    tapState: ITapState;

    stateOfMug$: AngularFirestoreDocument<IMugState>;
    mugState: IMugState;

    completedOrderIds: string[];
    queuedOrderIds: string[];

    pouringLiquid: HTMLElement;
    isLoaded: boolean;
    useSound: boolean;
    pouringHeight: number;
    mugLiquidHeight: number;

    constructor(public dataService: DataService) {
        this.isLoaded = false;
        this.useSound = false;

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

            if (this.useSound) {
                if (this.tapState.isPouring) {
                    this.beerAudioBegin.play();
                    this.beerAudioBack.play();
                } else {
                    this.beerAudioBegin.pause();
                    this.beerAudioBack.pause();
                }
            }

            this.isLoaded = true;
        });

        this.stateOfMug$ = this.dataService.stateOfMug;
        this.stateOfMug$.valueChanges().subscribe(mug => {
            this.mugState = mug;
        });
    }

    ngOnInit() {
        this.pouringLiquid = document.getElementById('beer-pouring-from-tap');

        if (this.useSound) {
            this.beerAudioBack = document.getElementById('beer-audio-back') as HTMLAudioElement;
            this.beerAudioBack.src = '/assets/sounds/beer-sound-back.mp3';
            this.beerAudioBack.load();

            this.beerAudioBegin = document.getElementById('beer-audio-begin') as HTMLAudioElement;
            this.beerAudioBegin.src = '/assets/sounds/beer-sound-begin.mp3';
            this.beerAudioBegin.load();
        }

        // this.isLoaded = true;

        this.render();
    }

    private liquidAnimation(el, speed) {
        if (el) {
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
    }

    render() {
        if (this.isLoaded && this.tapState.isPouring) {
            this.liquidAnimation(this.pouringLiquid, 0.5);
        }
        requestAnimationFrame(this.render.bind(this));
    }
}
