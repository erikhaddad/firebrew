import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarComponent} from './bar.component';
import {RouterModule} from '@angular/router';
import {Store, StoreModule} from '@ngrx/store';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'bar', component: BarComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ])
    ],
    declarations: [BarComponent]
})
export class BarModule {
}
