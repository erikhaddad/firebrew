import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatronComponent} from './patron.component';
import {RouterModule} from '@angular/router';
import {DataService} from '../common/data.service';

@NgModule({
    declarations: [PatronComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'patron/:patronId', component: PatronComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ])
    ],
    providers: [
        DataService
    ]
})
export class PatronModule {
}

export {DataService};
