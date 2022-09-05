import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScenarioService{
    private listSubject = new Subject();
      constructor(private http: HttpClient){

      }

      refresh(){
        this.listSubject.next(null);
      }

      get(){
        const getOptions = {
            params: {}
        };
        return this.http.get<ScenariosResponse>('scenarios', getOptions).pipe(map((response: ScenariosResponse) => {
            return response.scenarios;
        }), catchError(this.handleError));
      }

      getById(id){
        return this.http.get<ScenarioResponse>(`scenarios/${id}`).pipe(catchError(this.handleError));
      }

      add(scenario){
        return this.http.post('scenarios', scenario).pipe(catchError(this.handleError));
      }

      delete(scenario){
        return this.http.delete(`scenarios/${scenario.id}`).pipe(catchError(this.handleError));
      }

      edit(scenario, id){
        scenario["id"] = parseInt(id);
        return this.http.put('mediaitems', scenario).pipe(catchError(this.handleError));
      }

      private handleError(error: HttpErrorResponse){
        console.log(error.message);
        return throwError('A data error occurred, please try again.');
      }

      public getFooBarList() {
        return this.listSubject.asObservable();
      }

      private round(num, places) {
        var multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }

      public isRemaining(scenario){
        let totalProbability = 0;
        let realScenario;
        this.getById(scenario.id).subscribe((scenarioReturn) =>
        {
          realScenario = scenarioReturn;
        });
        realScenario.childrenScenarios.forEach((child) =>{
          const childProability = parseFloat(child.probability);
          totalProbability += childProability;
        });
        if (this.round(totalProbability, 4) === 1){
          return false;
        }
        return true;
      }

      public isProbabilityGroupToHigh(parentScenario, scenarioID, newValue): boolean{
        let totalProbability = 0;
        let parent;
        this.getById(parentScenario.id).subscribe((scenarioReturn) =>
        {
            parent = scenarioReturn;
        });
        const childrenScenarios = parent.childrenScenarios;
        childrenScenarios.forEach((child) =>
        {
          if (child.id === scenarioID)
          {
            return;
          }
          let probability = parseFloat(child.probability);
          totalProbability += probability;
        });
        totalProbability += newValue;
        if (totalProbability > 1)
        {
          return true;
        }
        return false;
      }
}

export interface Scenario {
    id: number,
    shotType: string,
    probability: number,
    strokes: number,
    parent: Scenario,
    childrenScenarios: Scenario[]
}

interface ScenariosResponse{
    scenarios: Scenario[];
}

interface ScenarioResponse{
  scenario: Scenario;
}