"use client";
import React from "react";

const TableComponent = ({ columns, data }) => {
    return (
        <div className="flex flex-col overflow-x-auto">
            <div className="sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm border border-gray-300">
                            {/* Encabezado */}
                            <thead className="border-b font-medium bg-gray-200">
                            <tr className="text-center">
                                {columns.map((col, index) => (
                                    <th key={index} className="px-3 py-2 border">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            {/* Cuerpo con filas alternadas */}
                            <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-3 py-2 border">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;