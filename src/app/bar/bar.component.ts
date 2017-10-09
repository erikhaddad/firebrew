import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {IOrder, IPatron} from '../common/data-model';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../common/data.service';

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

    ordersCollection: AngularFirestoreCollection<IOrder>;
    orders: Observable<IOrder[]>;

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

        this.ordersCollection = dataService.orders;
        this.orders = this.ordersCollection.valueChanges();
    }

    ngOnInit() {
        this.pouringLiquid = document.getElementById('beer-pouring-from-tap');
        this.isPouring = true;
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
}
