import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'home', component: HomeComponent},
            {path: '', pathMatch: 'full', component: HomeComponent}
        ]),
        FlexLayoutModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule {
}
