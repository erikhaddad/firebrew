import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

const SCREEN_MOBILE = 'screen and (max-width: 600px)';

@Injectable()
export class LayoutService implements OnDestroy {

    activeMediaQuery: string;
    watcher: Subscription;

    private _mobileWidthState: boolean;

    // Observable boolean sources
    private widthMobileAnnouncedSource = new Subject<boolean>();

    // Observable boolean streams
    widthMobileAnnounced$ = this.widthMobileAnnouncedSource.asObservable();

    constructor(public media: ObservableMedia) {
        this.activeMediaQuery = '';

        // Defaults
        this.handleWidthMobile(false);

        this.watcher = media.subscribe((change: MediaChange) => {
            this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
            // console.log('constructor', change.mqAlias, change, this.activeMediaQuery);

            if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                this.setMobile();
            } else {
                this.setDesktop();
            }
        });
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

    setDesktop() {
        this.handleWidthMobile(false);
    }

    setMobile() {
        this.handleWidthMobile(true);
    }

    handleWidthMobile(isMobile: boolean) {
        this.mobileWidthState = isMobile;
        this.widthMobileAnnouncedSource.next(isMobile);
    }

    get mobileWidthState(): boolean {
        return this._mobileWidthState;
    }

    set mobileWidthState(value: boolean) {
        this._mobileWidthState = value;
    }
}
