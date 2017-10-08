import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {IOrder, IPatron, Order, OrderStatus} from '../common/data-model';
import * as firebase from 'firebase';

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

    beerCost = 6;
    pouringLiquid: HTMLElement;
    isPouring: boolean;
    isLoaded: boolean;

    currentOrder: IOrder;
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
    }

    ngOnInit () {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.patronId = params['patronId'];

            this.patron$ = this.dataService.getPatron(this.patronId);
            this.patron$.valueChanges().subscribe(patron => {
                this.patron = patron;
            });
        });

        this.pouringLiquid = document.getElementById('beer-pouring-liquid');
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

    getMobileOS () {
        const e = navigator.userAgent || navigator.vendor || window['opera'];

        return e.match(/iPad/i) || e.match(/iPhone/i) || e.match(/iPod/i) ? 'iOS' : e.match(/Android/i) ? 'Android' : 'unknown';
    }

    iOSversion () {
        const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
    }

    onDeviceMotion (evt) {
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

    createOrder () {
        const order = new Order();

        order.patronId = this.patron.id;
        order.name = this.patron.name;
        order.avatar = this.patron.avatar;
        order.createdAt = firebase.database.ServerValue.TIMESTAMP;

        order.cost = this.beerCost;
        order.status = OrderStatus.PENDING;
        order.progress = 0;

        this.dataService.createOrder(order);
    }
}
