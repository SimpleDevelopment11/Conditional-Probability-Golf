import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScenarioComponent } from './scenario.component';
import { ScenarioListComponent } from './scenario-list.component';
import { MockXHRBackend } from './mock-xhr-backend';
import { ScenarioFormComponent } from './scenario-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StrokesPipe } from './strokes-probability.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ScenarioComponent,
    ScenarioListComponent,
    ScenarioFormComponent,
    StrokesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HttpXhrBackend, useClass: MockXHRBackend }],
  bootstrap: [AppComponent],
})
export class AppModule { }
