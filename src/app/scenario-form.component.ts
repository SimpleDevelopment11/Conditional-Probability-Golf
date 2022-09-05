import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { ScenarioService, Scenario } from "./scenario.service";

@Component({
    selector: "cp-form",
    templateUrl: "./scenario-form.component.html",
    styleUrls: ["./scenario-form.component.css"]
})
export class ScenarioFormComponent implements OnInit {
    form: FormGroup;
    @Input() parent: number;
    @Input() editID: number;
    @Input() isEdit: boolean;
    probabilityRegex = /^-?\d*[.,]?\d{0,4}$/;
    strokesRegex = /^[0-9]*$/;

    constructor(private formBuilder: FormBuilder, private scenarioService: ScenarioService) {}

    ngOnInit(){
        this.form = this.createForm();
    }   

    createForm(){
        let shotType = '';
        let probability = '';
        let strokes = '';
        let former = null;
        if (this.isEdit)
        {
            let scenario = null;
             this.scenarioService.getById(this.editID).subscribe((scenarioReturn) =>
            {
                scenario = scenarioReturn;
            });
            shotType = scenario.shotType;
            probability = scenario.probability;
            strokes = scenario.strokes;
        }
        former = this.formBuilder.group({
            shotType: this.formBuilder.control(shotType, Validators.compose([Validators.required])),
          });
        if (this.parent)
        {
            former.addControl("probability", new FormControl(probability, Validators.compose([Validators.required, this.patternValidator(this.probabilityRegex, "Probability must be a decimal value (max 4 decimal places)"), this.probabilityCheck()])));
            former.addControl("strokes", new FormControl(strokes, Validators.compose([Validators.required, this.patternValidator(this.strokesRegex, "Strokes must be a positive integer")])));
        }
        return former;
    }

    patternValidator(regex: RegExp, message: string): ValidatorFn
    {  
        return (control: FormControl) =>
        {
            if (control.value)
            {
                if (control.value.trim().length === 0) {
                    return null;
                }
                if (!control.value.match(regex))
                {
                    return {
                        error: message
                    };
                }
            }
            return null;
        }
    }

    probabilityCheck(): ValidatorFn
    {  
        return (control: FormControl) =>
        {
            let newProbability = parseFloat(control.value);
            if ((newProbability) > 1)
            {
                return {
                    error: "Probability cannot be greater than 1"
                } 
            }
            if (this.parent)
            {
                let editId = null;
                if (this.editID)
                {
                    editId = this.editID;
                }
                if (this.scenarioService.isProbabilityGroupToHigh(this.parent, editId, newProbability))
                {
                    return {
                        error: "Overall group probability is too high"
                    }
                }
            }
            return null;
        }
    }

    onSubmit(scenario){
        scenario.parent = this.parent;
        if (this.isEdit)
        {
            this.scenarioService.edit(scenario, this.editID).subscribe(() =>
            {
                this.scenarioService.refresh();
                this.form = this.createForm();
            });
            return;
        }
        this.scenarioService.add(scenario).subscribe(() =>
        {
            this.scenarioService.refresh();
            this.form = this.createForm();
        });
    }
}