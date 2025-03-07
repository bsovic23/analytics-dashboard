import { utils, writeFile } from 'xlsx';

const GeneralTable = ({ dataObjects }) => {
  if (!dataObjects || Object.keys(dataObjects).length === 0) {
    console.error('Data is empty. Cannot generate Excel file.');
    return;
  }

  let worksheetData = [];

  Object.entries(dataObjects).forEach(([title, data], index) => {
    if (index > 0) {
      worksheetData.push([]); // Add an empty row between sections
    }
    
    // Add title row
    worksheetData.push([title]); 
    
    // Add column headers
    worksheetData.push(['Variable', 'Count']); 

    // Add data rows
    Object.entries(data).forEach(([key, value]) => {
      worksheetData.push([key, value]);
    });
  });

  // Convert worksheet data to a worksheet
  const ws = utils.aoa_to_sheet(worksheetData);

  // Adjust column widths
  ws['!cols'] = [
    { wch: 20 }, // Column A (Variable)
    { wch: 10 }  // Column B (Count)
  ];

  // Create a new workbook and append the worksheet
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'TableData');

  // Write the workbook to a file
  writeFile(wb, 'table_data.xlsx');
};

export default GeneralTable;

/*  

THIS BELOW WITH: 
   <GeneralTable dataObjects={{ raceData }} />

gives the name and count in clumns A and B !!!! WORKS @!!!!!!

import { utils, writeFile } from 'xlsx';

const generalTable = ({ dataObjects }) => {
  if (!dataObjects || Object.keys(dataObjects).length === 0) {
    console.error('Data is empty. Cannot generate Excel file.');
    return;
  }

  let worksheetData = [];

  // Loop through the key-value pairs inside the nested dataObjects (e.g., raceData)
  for (const [key, value] of Object.entries(dataObjects.raceData)) {
    worksheetData.push([key, value]); // Push each key-value pair in columns A and B
  }

  // Convert worksheet data to a worksheet
  const ws = utils.aoa_to_sheet(worksheetData);

  // Adjust column widths for better readability
  ws['!cols'] = [
    { wch: 30 }, // Column A (Keys)
    { wch: 40 }  // Column B (Values)
  ];

  // Create a new workbook and append the worksheet
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'TableData');

  // Write the workbook to a file
  writeFile(wb, 'table_data.xlsx');
};

export default generalTable;


*/