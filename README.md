

# README


## Purpose:
Using data received from a network request, render a reusable table component that 
  dynamically generates columns based on the number of attributes each data object
  has, and generates a requested number of rows in the table per page.

### Should Also include
    Pagination buttons
      - Buttons that make backend requests for the next set of data (including first and last buttons)
    Sorts for each of the columns   
      - First click sorts the row, second click reverses the order
      - Clicks should make requests to the backend for fresh data;
    Search Input
      - A search input that lets users search for information in any of the fields
      - Submiting this should make calls to the backend for the currently sorted row (if there is one);

## RUN INSTRUCTIONS:
```
npm install -g live-reload

navigate to parent directory of this folder in terminal

live-reload reusable-table-component

```

## In the event that the Above fails (or its just too much trouble), just visit this plnkr link:

NOTE: Plnkr seems to error our a LOT when making GET requests to local .json files. It will run much smoother on your local machine.

```
https://plnkr.co/edit/q3Eb06Cv7WkxgheOaQsj?p=preview
```
