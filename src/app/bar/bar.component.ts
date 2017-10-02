import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

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

    constructor(private afs: AngularFirestore) {
        this.itemCollection = this.afs.collection<Item>('items');
        this.items = this.itemCollection.valueChanges(); // unwrapped snapshots
    }

    ngOnInit() {
    }

    addItem() {
        // must adhere to type Item
        this.itemCollection.add({name: 'thing', price: 10});
    }
}
