import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {environment} from '../environments/environment';
import {AuthModule} from './auth/auth.module';
import {SignInModule} from './sign-in/sign-in.module';
import {BarModule} from './bar/bar.module';
import {PatronModule} from './patron/patron.module';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {ServiceWorkerModule} from '@angular/service-worker';
import {MaterialModule} from './material/material.module';
import {HttpClientModule} from '@angular/common/http';
import {HomeModule} from './home/home.module';
import {LayoutService} from './common/layout.service';
import {HttpModule} from '@angular/http'; // deprecated but necessary for MatIconRegistry :(

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'firebrew'}),
        // Application routing
        RouterModule.forRoot([
            {path: 'bar', loadChildren: 'app/bar/bar.module#BarModule'},
            {path: 'patron/:patronId', loadChildren: 'app/patron/patron.module#PatronModule'},
            {path: '', loadChildren: 'app/home/home.module#HomeModule'}
        ]),
        HttpModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        // ServiceWorkerModule.register('/ngsw-worker.js'),
        BrowserAnimationsModule,

        MaterialModule,
        FlexLayoutModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,

        AuthModule,
        SignInModule,
        HomeModule,
        BarModule,
        PatronModule
    ],
    exports: [RouterModule],
    providers: [LayoutService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
