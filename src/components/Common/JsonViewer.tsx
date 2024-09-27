// app/components/JsonViewer.tsx
"use client";

import React from "react";
import { IRootObject, IRootObjectItem, LegacyData } from "@/types/legacy";

const JsonViewer: React.FC<{ data: IRootObject }> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <RootObjectItemView key={index} item={item} />
      ))}
    </div>
  );
};

const RootObjectItemView: React.FC<{ item: IRootObjectItem }> = ({ item }) => {
  return (
    <div className="mb-8 rounded border border-gray-300 p-4">
      <h2 className="mb-2 text-xl font-bold">{item.type}</h2>
      {item.version && (
        <p>
          <strong>Version:</strong> {item.version}
        </p>
      )}
      {item.comment && (
        <p>
          <strong>Comment:</strong> {item.comment}
        </p>
      )}
      {item.name && (
        <p>
          <strong>Name:</strong> {item.name}
        </p>
      )}
      {item.database && (
        <p>
          <strong>Database:</strong> {item.database}
        </p>
      )}
      {item.data && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Legacy Data:</h3>
          <LegacyDataTable data={item.data} />
        </div>
      )}
    </div>
  );
};

const LegacyDataTable: React.FC<{ data: LegacyData[] }> = ({ data }) => {
  if (data.length === 0) return <p>No data available</p>;

  const columns = Object.keys(data[0]) as (keyof LegacyData)[];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border border-gray-300 bg-gray-100 p-2"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="border border-gray-300 p-2">
                  {item[column] !== null ? String(item[column]) : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JsonViewer;
