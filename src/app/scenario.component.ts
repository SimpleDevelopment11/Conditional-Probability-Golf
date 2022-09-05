import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Scenario } from "./scenario.service";
import { ScenarioService } from "./scenario.service";
import { ScenarioSecondaryService } from "./scenario-secondary.service";

@Component({
    selector: 'cp-comp',
    templateUrl: './scenario.component.html',
    styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {
    @Input() scenario: Scenario;
    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();
    isEdit = false;
    secondarySubscription = null;

    constructor(private scenarioService: ScenarioService, private secondaryScenarioSerivce: ScenarioSecondaryService){

    }

    ngOnInit() {
        this.secondarySubscription = this.secondarySubscribe();
    }

    public isRemaining(){
        return this.scenarioService.isRemaining(this.scenario);
    }

    onDeletePass(scenario){
        this.delete.emit(scenario);
    }

    onEditPass(scenario){
        this.edit.emit(scenario);
        if (this.scenario.id === scenario.id)
        {
            this.isEdit = true;
            this.secondarySubscription.unsubscribe();
            this.secondaryScenarioSerivce.closeOtherEditForms();
            this.secondarySubscription = this.secondarySubscribe();
        }
    }

    secondarySubscribe()
    {
        return this.secondaryScenarioSerivce.getSubscription().subscribe((message) => {
            if (message === "removeEdit")
            {
                this.isEdit = false;
            }
        }); 
    }
    
};