import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatronComponent} from './patron.component';
import {RouterModule} from '@angular/router';
import {DataService} from '../common/data.service';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    declarations: [PatronComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'patron/:patronId', component: PatronComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FlexLayoutModule
    ],
    providers: [
        DataService
    ]
})
export class PatronModule {
}

export {DataService};
