import { HttpEvent, HttpRequest, HttpResponse, HttpBackend } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { Scenario } from './scenario.service';

export class MockXHRBackend implements HttpBackend {
  private scenarios = [
  ];

  private missingText = "Mising Full Probability";

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((responseObserver: Observer<HttpResponse<any>>) => {
      let responseOptions;
      switch (request.method) {
        case 'GET':
          if (request.url === 'scenarios') {
              let scenarios = this.scenarios;
              responseOptions = {
                body: {scenarios: JSON.parse(JSON.stringify(scenarios))},
              status: 200
              };
          } else {
            let scenario;
            const idToFind = parseInt(request.url.split('/')[1], 10);
            scenario = this._getScenarioByID(idToFind, this.scenarios);
            responseOptions = {
              body: JSON.parse(JSON.stringify(scenario)),
              status: 200
          }
          }
          break;
        case 'POST':
          const scenario = request.body;
          this._createScenario(scenario);
          responseOptions = {status: 201};
          break;
        case 'DELETE':
          const id = parseInt(request.url.split('/')[1], 10);
          this._deleteScenario(id);
          responseOptions = {status: 200};
          break;
        case 'PUT':
          const scenarioEdit = request.body;
          this._updateScenario(scenarioEdit);
          responseOptions = {status: 201};
          break;
      }

      const responseObject = new HttpResponse(responseOptions);
      responseObserver.next(responseObject);
      responseObserver.complete();
      return () => {
      };
    });
  }

  _createScenario(scenario)
  {
    scenario.id = this._getNewId();
      scenario.childrenScenarios = [];
      const parentScenario = this._getScenarioByID(scenario.parent, this.scenarios);
      scenario.calculatedStrokes = scenario.strokes;
      if (parentScenario)
      {
        parentScenario.childrenScenarios.push(scenario);
      }
      else
      {
        scenario.strokes = 0
        scenario.calculatedStrokes = this.missingText;
        this.scenarios.push(scenario);
      }
      this._updateCheck(scenario);
      return;
  }

  _deleteScenario(id) {
    const scenario = this._getScenarioByID(id, this.scenarios);
    const parent = this._getScenarioByID(scenario.parent, this.scenarios);
    if (parent === null)
    {
      const index = this.scenarios.indexOf(scenario);
      if (index >= 0)
      {
        this.scenarios.splice(index, 1);
      }
      return;
    }
    const index = parent.childrenScenarios.indexOf(scenario);
    if (index >= 0)
    {
      parent.childrenScenarios.splice(index, 1);
    }
    this._updateCheck(scenario);
  }

  _updateScenario(scenarioEdit){
    const scenario = this._getScenarioByValues(scenarioEdit, this.scenarios);
    if (scenario)
    {
      scenario.shotType = scenarioEdit.shotType;
      if (scenarioEdit.probability)
      {
        scenario.probability = scenarioEdit.probability;
      }
      if (scenarioEdit.strokes)
      {
        scenario.strokes = scenarioEdit.strokes;
        this._performProbabilityCheck(scenario);
      }
    }
    this._updateCheck(scenario);
    return;
  }

  _updateCheck(scenario)
  {
    this._checkForProbability(scenario);
    if (scenario.childrenScenarios.length > 0)
    {
      this._checkForProbability(scenario.childrenScenarios[0]);
    }
  }

  _checkForProbability(scenario){
    let parentScenario = this._getScenarioByID(scenario.parent, this.scenarios);
    if (!parentScenario){
      return;
    }

    this._performProbabilityCheck(parentScenario);
    this._checkForProbability(parentScenario);

  }

  _performProbabilityCheck(parentScenario)
  {
    let totalProbability = 0;
    let expectedStrokes = 0;
    parentScenario.childrenScenarios.forEach((child) =>{
      if (!child.strokes){
        return;
      }
      const probability = parseFloat(child.probability);
      const strokes = parseFloat(child.calculatedStrokes);
      totalProbability += probability;
      expectedStrokes += probability * strokes;
    });
    if (totalProbability == 1){
      parentScenario.calculatedStrokes = parentScenario.parent === null ? expectedStrokes : (expectedStrokes + parseInt(parentScenario.strokes)).toString();
    }
    else
    {
      parentScenario.calculatedStrokes = parentScenario.parent === null ? this.missingText : parentScenario.strokes;
    }
  }

  _getNewId() {
    if (this.scenarios.length > 0) {
      let idArray = [];
      return Math.max.apply(Math, getScenarioIdArray(idArray, this.scenarios)) + 1;
    } else {
      return 1;
    }

    function getScenarioIdArray(array, scenarios)
    {   
        scenarios.forEach((scenario) => {
          array.push(scenario.id);
          getScenarioIdArray(array, scenario.childrenScenarios);
        });
        return array;
    }
  }

  _getScenarioByID(scenarioID, scenarios){
    let scenarioMatch = null;
    scenarios.forEach(i => {
      if (scenarioMatch)
      {
        return;
      }
      if (scenarioID === i.id)
      {
        scenarioMatch = i;
        return;
      }
      scenarioMatch = this._getScenarioByID(scenarioID, i.childrenScenarios);
    })
    return scenarioMatch;
  }

  _getScenarioByValues(scenario, scenarios){
    if (scenario === null)
    {
      return null;
    }
    return this._getScenarioByID(scenario.id, scenarios);
  }

}