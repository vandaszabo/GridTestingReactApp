import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css';

import './App.css';

function App() {

  const [gridApi, setGridApi] = useState(null);
  console.log("gridapi: ",gridApi);
  const perPage = 50;
  const paginationPageSizeSelector = [10, 20, 50, 100];
  const columns = [
    { field: "employeeID", headerName: "Employee ID" },
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "jobTitle", headerName: "Job Title" },
    { field: "hireDate", headerName: "Hire Date" },
    { field: "departmentID", headerName: "Department ID" }
  ]

  const dataSource = {
    pageSize: perPage,
    getRows: (params) => {
      console.log("Request params: ",JSON.stringify(params));
      let url=`http://localhost:5105/api/Employee/GetEmployees?`;
      
      // // Sorting
      // if(params.sortModel.length){
      //   const {colId, sort} = params.sortModel[0]
      //   url+=`OrderByColumn=${colId}&OrderDir=${sort}&`
      // }

      // // Filtering
      // const filterKeys = Object.keys(params.filterModel);
      // filterKeys.forEach(key=>{
      //  url+= `${key}=${params.filterModel[key].filter}&`;
      // })
      
      // Pagination
      const page = Math.floor(params.endRow / perPage);
      url+=`CurrentPage=${page}&PageSize=${perPage}`
      console.log("Fetching page:", page);
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const { data, totalRecords } = res;
          params.successCallback(data, totalRecords);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          params.failCallback();
        });
    }
  };
  console.log("dataSource: ", dataSource);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.setDatasource(dataSource);
  };

  return (
    <div className="App">
      <h2>
        Server side pagination in the React AG Grid
      </h2>
      <div className="ag-theme-quartz-dark" style={{ height: 700, width: 1500 }}>
        <AgGridReact
          datasource={dataSource}
          pagination={true}
          rowModelType={"infinite"} // Set row model type to infinite for server-side pagination
          paginationPageSize={perPage}
          paginationPageSizeSelector={paginationPageSizeSelector}
          cacheBlockSize={perPage}
          maxBlocksInCache={3}  // Number of pages to keep
          onGridReady={onGridReady}
          rowHeight={60}
          defaultColDef={{ flex: 1, filter: true, floatingFilter: true, sortable: true }}
          columnDefs={columns}
        />
      </div>
    </div>
  );
}

export default App;