import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarComponent} from './bar.component';
import {RouterModule} from '@angular/router';
import {DataService} from '../common/data.service';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    declarations: [BarComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'bar', component: BarComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FlexLayoutModule
    ],
    providers: [
        DataService
    ]
})
export class BarModule {
}

export {DataService};