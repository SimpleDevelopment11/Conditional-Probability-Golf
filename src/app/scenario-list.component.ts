import { Component } from "@angular/core";
import { ScenarioService, Scenario } from "./scenario.service";
import { OnInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
    selector: 'cp-list-comp',
    templateUrl: './scenario-list.component.html',
    styleUrls: ['./scenario-list.component.css']
})
export class ScenarioListComponent implements OnInit {
    private subscription: Subscription;
    scenarios: Scenario[];

    constructor(private scenarioService: ScenarioService){

    }

    ngOnInit(){
        this.getScenarios();

        this.subscription = this.scenarioService.getFooBarList().subscribe(() => {
            this.getScenarios();
        });
    }

    getScenarios(){
        this.scenarioService.get().subscribe((scenarios) => {
            this.scenarios = scenarios;
        })
    }

    onScenarioDelete(scenario){
        this.scenarioService.delete(scenario).subscribe(() =>
        {
            this.getScenarios();
        });
    }

    onScenarioEdit(scenario){
        (this.scenarioService.getById(scenario.id).subscribe((scenario) =>
        {
            
        }));
    }

    
};