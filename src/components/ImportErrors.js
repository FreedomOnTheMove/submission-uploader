import * as React from "react";

export default function ImportErrors(props) {
  let rowkey = 0;
  return (
      <div className="col-8 offset-2">
        <table className="table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {props.errors.map((e) => {
              return(
                  <tr key={rowkey++}>
                    <th>
                      {e.message}
                    </th>
                    <th>
                      {e.cause.message}
                    </th>
                  </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
}