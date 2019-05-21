
# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

It contains module to upload a file, display temperature chart.

Chart service will listen to incoming data from server and display on UI. Currently it works on dummy data instead of actual data from database.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Server

Run `node index.js` to start the server.

Server will store uploaded file and process and save it to database.

I have used mongo cloud credetials which can be changed with users credentials.

Charts relatime data is emitted from a service at server end.
