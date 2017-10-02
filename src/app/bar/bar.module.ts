import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarComponent} from './bar.component';
import {RouterModule} from '@angular/router';

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
