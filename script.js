
/*
See the README.md for RUN instruction :)
*/

let app = angular.module('myApp', []);


//-- ---------- --\\
//-- CONTROLLER --\\
//-- ---------- --\\

//This controller manages state of our app and passes data updates to its child components
app.controller('mainCtrl', function($scope, dataService){
      $scope.page = "Home";
          
      $scope.fetchData = function(numberOfEntries=0, datatype){
        const range = [0, numberOfEntries];
        dataService.getData(datatype, range)
        .then((res)=>{
          $scope.table = res;
        });
      };
      
      $scope.goToPage = function(pageNumber){
        $scope.table.getPageNum(pageNumber);
      }
      
      $scope.setSortType = function(sortType){
        $scope.table.setSortType(sortType)
      }
      
      $scope.search = function(searchTerm){
        $scope.table.getPageNum(1, searchTerm, true)
      }

      $scope.reset = function(){
        $scope.table.reset();
      }
      
});



//-- ---------- --\\
//-- COMPONENTS --\\
//-- ---------- --\\

// Reusable Table Component that adapts to data-input
app.component('generalTable', {
  templateUrl: './templates/generalTable.template.html',
  controller: function () {
    this.$onInit = () => {
      this.resetData = function () {
        this.searchTerm = '';
        this.reset()
      }
    }
  },
  // We can make our component portable and reusable by allowing developers
  // to enter in the data they want passed down to our components via bindings
  bindings: {
    table: '<',
    gotopage: '&',
    setsorttype: '&',
    search: '&',
    reset: '&'
  }
  
})

// Component responsible for setting the Table class properties and return a new class
app.component('setTable', {
  templateUrl: './templates/setTable.template.html',
  bindings: {
    fetchdata: '&'
  }
})





//-- -------- --\\
//-- SERVICES --\\
//-- -------- --\\

// A service for creating our table class
app.service('tableService', function ($http, tableDataService) {

    // A class for our tables
    // We generate a table class on initial data request and adjust the class moving forwards
    class generalTable {
    constructor(dataType, currentSortType, data, range, numPages){
      //Dynamic data
      this.dataType = dataType;
      this.currentSortType = currentSortType
      this.data = data;
      this.range = range;
      this.numPages = new Array(numPages);
      
      //Static Data
      this.currentPage = 1;
      this.sortReverse = false;
      this.currentSearchQuery = '';
    }
    // Methods for helping us update the data and properties of our table.
    getNumEntries () {
      return this.range[1] - this.range[0]
    }
    getStartOfRange() {
      return this.getEndOfRange() - this.getNumEntries();
    }
    getEndOfRange() {
      return this.currentPage * this.getNumEntries();
    }
    setSortType (sortType) {
      this.currentPage = 1;
      if(this.currentSortType === sortType){
        this.sortReverse = !this.sortReverse;
      } else {
        this.sortReverse = false;
        this.currentSortType = sortType;
      }
      tableDataService.getPage(this)
      .then((res)=>{
        this.data = res;
      });
    }
    getNumPages (totalEntries, pageLength) {
      return Math.ceil(totalEntries/pageLength);
    }
    getPageNum (pageNum, searchTerm, refreshPageNumbers=false) {
      this.currentPage = pageNum;
      if(searchTerm) this.currentSearchQuery = searchTerm;
      if(refreshPageNumbers) this.refreshPageNumbers = true;

      tableDataService.getPage(this)
      .then((res)=>{
        this.data = res;
      })
      .catch((err)=>{
        console.error("getPageNum Error", err);
      })
    }
    compare (a, b) {
        const sortType = this.currentSortType;
        const type = typeof a[sortType];
        const objA = (type === 'string') ? a[sortType].toUpperCase() : a[sortType];
        const objB = (type === 'string') ? b[sortType].toUpperCase() : b[sortType];
      
        let comparison = 0;
        if (objA > objB) comparison = 1;
        else if (objA < objB) comparison = -1;
        
        return comparison;
    }
    reset () {
      this.currentPage = 1;
      this.currentSearchQuery = '';
      this.refreshPageNumbers = true;
      tableDataService.getPage(this)
      .then((res)=>{
        this.data = res;
      })
      .catch((err)=>{
        console.error("getPageNum Error", err);
      })
    }
  };

  function generateTable (dataType, currentSortType, data, range, numPages) {
    return new generalTable (dataType, currentSortType, data, range, numPages)
  }

  return { generateTable }

})

//A service for managing table data
app.service('tableDataService', function($http){
  
  //Gets requested page bassed on Search Query, Entries Per Page Requested, Type of Data, and Sort type
  function getPage (table) { 
    return $http({
      method: 'GET',
      url: table.dataType,
      headers: {
       'Content-Type': undefined
      },
      //Mock Request (for DB Query):
      data: { 
        sortType: table.currentSortType, //The column of data to sort
        dataType: table.dataType, //The type of data we want to get (users, locks, etc)
        searchTerm: table.currentSearchQuery,
        range: [table.getStartOfRange(), table.getEndOfRange()],//range of data
        isSortReversed: table.sortReverse //reverse order, T/F
      },
      //Expected Response:
      response: {
        status: 200, //Status for get request should come back OK
        totalNumEntries: Number, //Allows us to set number of pages;
        arrayOfDataObjects: []  //Data within our requested range;
      }
    })
    // Again, we can imagine this sort of 
    // sorting/slicing is being handled by our DB Querie
    .then((response) => {
      // Here's where I will just quickly 'MOCK' our above DB Query

      // Returns matches with our current Search Query
      let results;
      if(table.currentSearchQuery){
        results = response.data.filter(function (entry) {
          for(let key in entry){
            if(entry[key].toString().indexOf(table.currentSearchQuery.toString()) > -1) return entry;
          }
        });
      } else {
        results = response.data;
      }

      if(table.refreshPageNumbers){
        table.numPages = new Array(Math.ceil(results.length/table.getNumEntries()));
        table.refreshPageNumbers = false;
      }

      // Reterns reversed data if neccessary
      if (table.sortReverse) return results.sort(table.compare.bind(table)).reverse().slice(table.getStartOfRange(), table.getEndOfRange());
      else return results.sort(table.compare.bind(table)).slice(table.getStartOfRange(), table.getEndOfRange());
      

    }, (err)=>{
      console.error("getpage Error:", err);
      return {err}
    })
  }

  return {
    getPage
  }

})

// A service to manage inital data requests
app.service('dataService', function ($http, tableService) {
  
  // We can imagine our 'datatype' parameters represents a URL 
  // to a specific API Resource
  
  // This function is responsible for making the inital data request and initializing our table class;
  function getData (dataType, range, sortType="id" ) {
    const numberOfEntries = range[1] - range[0];
    
    return $http({
      method: 'GET',
      url: dataType,
      headers: {
       'Content-Type': undefined
      },
      //Mock Request (for DB Query):
      data: { 
        sortType: sortType, // column to sort (defaults as 'id')
        dataType: dataType, // Redundant, also in URL
        searchTerm: '', //defaults to empty string
        range: range, // requested range of data
        isSortReversed: false // initialize as false
      },
      //Expected Response:
      response: {
        status: 200, // Status for get request should come back OK
        totalNumEntries: Number, // Allows us to set number of pages;
        arrayOfDataObjects: []  // Data within our requested range and params;
      }
    })
    .then((response)=>{
      // Here's where I will just quickly 'MOCK' our above DB Query
      
      const numPages = Math.ceil(response.data.length/numberOfEntries);
      const dataArray = response.data.slice(0, numberOfEntries);
      
      return tableService.generateTable(dataType, sortType, dataArray, range, numPages);
      
    })
    .catch((err)=>{
      console.log("Error runs");
      throw err;
    });
  }
        
  return {
    getData
  }
})



