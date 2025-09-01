import React from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonTableProps {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: {
    feature: string;
    values: (boolean | string)[];
  }[];
  className?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  title, 
  subtitle, 
  columns, 
  rows, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {subtitle && <p className="text-blue-100">{subtitle}</p>}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Critères
              </th>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {row.feature}
                </td>
                {row.values.map((value, valueIndex) => (
                  <td key={valueIndex} className="px-6 py-4 text-center">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-700">{value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;