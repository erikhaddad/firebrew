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
    isPouring: boolean;
    isLoaded: boolean;

    constructor(public dataService: DataService,
                public authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
        this.isLoaded = false;
    }

    ngOnInit () {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.userId = params['patronId'];

            this.user$ = this.dataService.getUser(this.userId);
            this.user$.valueChanges().subscribe(user => {
                this.user = user;
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
}