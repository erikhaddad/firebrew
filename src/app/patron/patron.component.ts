import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {IUser} from '../common/data-model';

@Component({
    selector: 'app-patron',
    templateUrl: './patron.component.html',
    styleUrls: ['./patron.component.scss']
})
export class PatronComponent implements OnInit {

    paramSubscription: any;
    userId: string;
    user$: AngularFirestoreDocument<IUser>;
    user: IUser;

    pouringLiquid: HTMLElement;
    pourButton: HTMLElement;
    beerTap: HTMLElement;
    beerTapShadow: HTMLElement;
    isPouring: boolean;
    isLoaded: boolean;

    constructor(public dataService: DataService,
                public authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
        this.isLoaded = false;
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.userId = params['userId'];

            this.user$ = this.dataService.getUser(this.userId);
            this.user$.valueChanges().subscribe(user => {
                this.user = user;
            });
        });

        this.pouringLiquid = document.getElementById('beer-pouring-liquid');
        this.pourButton = document.getElementById('pour-button');
        this.beerTap = document.getElementById('beer-tap-top');
        this.beerTapShadow = document.getElementById('beer-tap-top-shadow');
        this.isPouring = false;
        this.isLoaded = true;

        // this.render();
        // this.init();
    }

    hasClass (element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    addClass (element, cls) {
        if (!this.hasClass(element, cls)) {
            element.className += ' ' + cls;
        }
    }

    removeClass (element, cls) {
        if (this.hasClass(element, cls)) {
            const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }

    liquidAnimation (el, speed) {
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

    render() {
        if (this.isPouring) {
            this.liquidAnimation(this.pouringLiquid, 0.5);
            this.addClass(this.pourButton, 'clicked');
            this.addClass(this.pouringLiquid, 'pouring');
            this.beerTap.setAttribute('class', 'clicked');
            this.beerTapShadow.setAttribute('class', 'clicked');

        } else {
            this.removeClass(this.pourButton, 'clicked');
            this.removeClass(this.pouringLiquid, 'pouring');
            this.beerTap.setAttribute('class', '');
            this.beerTapShadow.setAttribute('class', '');
        }
        requestAnimationFrame(this.render);
    }

    toggleIsPouring() {
        this.isPouring = !this.isPouring;
    }

    init() {
        const that = this;
        this.pourButton.addEventListener('mousedown', function (e) {
            that.isPouring = true;
        });
        document.documentElement.addEventListener('mouseup', function (e) {
            that.isPouring = false;
        });
        window.onload = function () {
            that.addClass(document.getElementById('instructions-container'), 'loaded');
        };
    }


}
