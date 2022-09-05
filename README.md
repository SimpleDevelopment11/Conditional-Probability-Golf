# ConditionalProbability

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Overview

This project is single-page application that allows users to use statistics in the form of conditional probability to determine the expected outcome of various events. Specifically, the application is geared towards helping golfers determine the best strategy by which to play a given hole. 

For example, a golfer can decide to hit driver off the tee or decide to hit a safer shot with an iron. To determine whether using driver or hitting an iron will on average produce the lower score, enter each consecutive shot possibility into the application and it will calculate the expected value of each respective decision.

## Concepts

** Component-based architecture implemented with a three-tier architecture that separates the view and viewmodels from the service/business logic layer and the data layer, which in this case does not keep permnanent records but only stores data creating in each iteration of the application.

** Recursion. The application allows for the creation of theoretically infinite nested scenarios. To perform various operations such as looking up all children or finding a scenario in the tree, recursion is necessary.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
