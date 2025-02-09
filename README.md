# AgencyMapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.4.

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

## Create Component

-- ng g c componentName
-- ng generate component <componentName>

## Run project

-- ng serve

## Build project

-- ng build
-- npm ci && npm run build

## Install AG grid:

-- npm i ag-grid-angular
-- npm i @ag-grid-community/core
-- npm i @ag-grid-community/client-side-row-model

## delete last commit

-- git reset --hard HEAD~1
-- git reset --hard 2b1ab85 (2b1ab85 is Commit SHA number you want to set to. Commits after this SHA will be removed)

## Git commit and push command
git add . && git commit -m "added delete attendance feature" && git push

## AG-GRID :
# Curreny formatter :
{
      field: 'billAmount',
      flex: 2,
      editable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => this.currencyFormatter(params),
    },

  currencyFormatter(params: any) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(params.value);
  }

  # Value Getter/Setter and formatter :
    {
      field: 'paymentStatus',
      flex: 2,
      editable: true,
      cellEditor: DropdownRendererComponent,
      cellEditorParams: {
        values: this.paymentStatusList,
      },
      valueFormatter: this.dropdownValueFormatter,
      valueGetter: (params) => params.data.paymentStatus,
      valueSetter: (params) => {
        params.data.paymentStatus = params.newValue;
        return true;
      },
    },

    dropdownValueFormatter(params: any): string {
    return params.value;
  }
