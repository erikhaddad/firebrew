import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import 'hammerjs';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
        registerServiceWorker('ngsw-worker');
    });

function registerServiceWorker(swName: string) {
    // console.log('is it production?', environment.production);
    if (environment.production) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register(`/${swName}.js`)
                .then(reg => {
                    console.log('[App] Successful service worker registration', reg);
                })
                .catch(err =>
                    console.error('[App] Service worker registration failed', err)
                );
        } else {
            console.error('[App] Service Worker API is not supported in current browser');
        }
    } else {
        console.warn('[App] Skipping service worker registration in development environment');
    }
}
