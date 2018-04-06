

# README

I've decided to use Angular 1.6 for simplicity sake, but I am happy to 
re-create this is in any of the major frameworks (ie Angular 2+ or React).

The basic principles here are re-usable components, seperation of concerns,
component application architecture, and most importantly I think I demonstrate 
well what I believe was the focus of the excercise - to demonstrate sound 
communication with a RESTFUL API and to have the data cleanly render to a 
reusable component.

I've included comments that should explain everything

Thank you so much for taking a glance at this!


## Challenge:
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
