import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScenarioSecondaryService{
    private listSubject = new Subject();

    closeOtherEditForms()
    {
        this.listSubject.next("removeEdit");
    }

    getSubscription()
    {
        return this.listSubject.asObservable();
    }
}