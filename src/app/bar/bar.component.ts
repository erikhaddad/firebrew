import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

export interface Item {
    name: string;
    price: number;
}

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

    itemCollection: AngularFirestoreCollection<Item>;
    items: Observable<Item[]>;

    constructor(private afs: AngularFirestore, private store: Store<any>) {
        this.items = this.store.select(a => a.items);
        this.itemCollection = this.afs.collection<Item>('items');
        this.itemCollection.stateChanges().do(actions => {
            actions.forEach(a => {
                // a.type: "added"
                // a.payload: DocumentChange
                // dispatch to ngrx/store
                store.dispatch(a);
            })
        }).subscribe();
    }

    ngOnInit() {
    }

    addItem() {
        // must adhere to type Item
        this.itemCollection.add({name: 'thing', price: 10});
    }
}
