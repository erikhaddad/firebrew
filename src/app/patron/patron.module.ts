import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatronComponent} from './patron.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'patron/:patronId', component: PatronComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ])
    ],
    declarations: [PatronComponent]
})
export class PatronModule {
}
