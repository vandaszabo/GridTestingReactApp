import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid
import './App.css';

function App() {
  // Row Data: The data to be displayed.
  const [data, setData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  // Set column features
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      sortable: true,
      floatingFilter: true,
    };
  }, []);

  // Fetch data and set state
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Await fetch response
        const response = await fetch('https://localhost:7076/api/Employee/Employees');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Await parsing of JSON
        const result = await response.json();

        // Set data
        setData(result);
        console.log("Amount of data row received: ", result.length);

        // Create column definitions from object keys
        if (result.length > 0) {
          const keys = Object.keys(result[0]);
          const newColDefs = keys.map((key) => ({ field: key }));
          setColDefs(newColDefs);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-quartz-dark" style={{ height: 700, width: 1500 }}>
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
      />
    </div>
  );
}

export default App;
