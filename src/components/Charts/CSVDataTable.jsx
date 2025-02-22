import React from "react";
import './CSVDataTable.css'

const CSVDataTable = ({ data }) => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <main className="table" id="customers_table">
                <section className="table__header">
            <h1>Tweets Data</h1>
          </section>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <section className="table__body">
        <table
        //  style={tableStyle}
         >

          <thead>
            <tr>
              {headers.map((header, index) => (
                <th className="icon-arrow" key={index} 
                // style={tableHeaderStyle}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex} 
                  // style={tableCellStyle}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </section>
      )}
    </main>
  );
};

// const tableStyle = {
//   borderCollapse: "collapse",
//   width: "100%",
//   borderRadius: "10px",
//   overflow: "hidden",
//   boxShadow: "40px 90px 55px -20px rgba(155, 184, 243, 0.2)",
// };

// const tableHeaderStyle = {
//   fontSize: "14px",
//   fontWeight: 500,
//   color: "#ffffff",
//   backgroundColor: "#6D95E0",
//   borderBottom: "1px solid #ddd",
//   padding: "15px",
//   textAlign: "left",
// };

// const tableCellStyle = {
//   fontSize: "14px",
//   fontWeight: 500,
//   color: "black",
//   borderBottom: "1px solid #ddd",
//   padding: "15px",
//   backgroundColor: "#fff",
// };

export default CSVDataTable;
