import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {IPatron} from '../common/data-model';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {LayoutService} from '../common/layout.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isMobile: boolean;

    patron$: AngularFirestoreDocument<IPatron>;
    patron: IPatron;

    constructor(public authService: AuthService,
                public dataService: DataService,
                public layoutService: LayoutService) {

        this.patron = null;
        authService.authState$.subscribe(authUser => {
            if (authUser != null) {
                this.patron$ = dataService.getPatron(authUser.uid);
                this.patron$.valueChanges().subscribe(patron => {
                    if (patron) {
                        this.patron = patron;
                    }
                });
            }
        });

        this.isMobile = layoutService.mobileWidthState;
        layoutService.widthMobileAnnounced$.subscribe(
            isMobile => {
                this.isMobile = isMobile;
            });
    }

    ngOnInit() {
    }

}
