import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {IPatron} from './common/data-model';
import {AuthService} from './auth/auth.service';
import {DataService} from './common/data.service';
import {LayoutService} from './common/layout.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class AppComponent implements OnInit {

    authPatron$: AngularFirestoreDocument<IPatron>;
    authPatron: IPatron|null;

    currentPage: string;
    isMobile: boolean;

    constructor(public authService: AuthService,
                public dataService: DataService,
                public layoutService: LayoutService,
                private router: Router,
                private route: ActivatedRoute,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {

        this.currentPage = 'home';

        /** AUTH **/
        this.authPatron = null;
        authService.authState$.subscribe(authPatron => {
            if (authPatron != null) {
                this.authPatron$ = dataService.getPatron(authPatron.uid);
                this.authPatron$.valueChanges().subscribe(patron => {
                    this.authPatron = patron;
                });
            }
        });

        /** LAYOUT **/
        this.isMobile = layoutService.mobileWidthState;
        this.layoutService.widthMobileAnnounced$.subscribe(
            isMobile => {
                this.isMobile = isMobile;
            });

        /** ICONS **/
        iconRegistry.addSvgIcon(
            'google',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/google.svg'));

        iconRegistry.addSvgIcon(
            'facebook',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/facebook.svg'));

        iconRegistry.addSvgIcon(
            'twitter',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/twitter.svg'));

        iconRegistry.addSvgIcon(
            'github',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/github.svg'));

        iconRegistry.addSvgIcon(
            'avatar_disabled',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/avatar_disabled.svg'));

        iconRegistry.addSvgIcon(
            'avatar_anonymous',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/avatar_anonymous.svg'));
    }

    ngOnInit() {

    }

    logout(evt: Event): void {
        this.authService.signOut();
        this.router.navigate(['home']);
    }
}
