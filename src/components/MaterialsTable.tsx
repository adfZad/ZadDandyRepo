"use client"

import React from 'react'

export default function MaterialsTable({ rows, setRows, disabled }: { rows: any[], setRows: any, disabled?: boolean }) {
  const handleInputChange = (index: number, field: string, value: string) => {
    if (parseFloat(value) < 0) return;

    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    
    // Auto calculate Total = Opening Balance + Received from Store
    const ob = parseFloat(newRows[index].openingBalance) || 0;
    const rec = parseFloat(newRows[index].receivedFromStore) || 0;
    newRows[index].total = (ob + rec) > 0 ? (ob + rec).toString() : '';

    // Auto calculate Closing Balance = Total - (Filled + FillingWastage + PackingWastage)
    const tot = parseFloat(newRows[index].total) || 0;
    const filled = parseFloat(newRows[index].filledSaleable) || 0;
    const fw = parseFloat(newRows[index].fillingWastage) || 0;
    const pw = parseFloat(newRows[index].packingWastage) || 0;
    
    if (newRows[index].total || newRows[index].filledSaleable || newRows[index].fillingWastage || newRows[index].packingWastage) {
        newRows[index].closingBalance = (tot - (filled + fw + pw)).toString();
    } else {
        newRows[index].closingBalance = '';
    }

    setRows(newRows);
  }

  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg mb-2">Packing Materials Usage / Wastage</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border-excel">
          <thead>
            <tr className="bg-header-excel">
              <th className="border border-border-excel p-2 font-semibold text-left w-1/4">Item / Kind</th>
              <th className="border border-border-excel p-2 font-semibold">Opening Balance</th>
              <th className="border border-border-excel p-2 font-semibold">Received from Store</th>
              <th className="border border-border-excel p-2 font-semibold">Total</th>
              <th className="border border-border-excel p-2 font-semibold">Filled Saleable pieces</th>
              <th className="border border-border-excel p-2 font-semibold">Filling Wastage / Damage</th>
              <th className="border border-border-excel p-2 font-semibold">Packing Material Wastage / Damage</th>
              <th className="border border-border-excel p-2 font-semibold">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const hasData = row.openingBalance || row.receivedFromStore || row.total || row.filledSaleable || row.fillingWastage || row.packingWastage || row.closingBalance;
              if (disabled && !hasData) return null;
              
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-border-excel p-1 font-medium bg-header-excel">
                    {row.itemKind}
                  </td>
                  <td className="border border-border-excel p-0">
                    {disabled ? <div className="p-1 text-center min-h-[28px]">{row.openingBalance}</div> : <input type="number" min="0" className="w-full h-full p-1 outline-none text-center" 
                      value={row.openingBalance} onChange={(e) => handleInputChange(idx, 'openingBalance', e.target.value)} />}
                  </td>
                  <td className="border border-border-excel p-0">
                    {disabled ? <div className="p-1 text-center min-h-[28px]">{row.receivedFromStore}</div> : <input type="number" min="0" className="w-full h-full p-1 outline-none text-center" 
                      value={row.receivedFromStore} onChange={(e) => handleInputChange(idx, 'receivedFromStore', e.target.value)} />}
                  </td>
                  <td className="border border-border-excel p-0 bg-gray-100">
                    {disabled ? <div className="p-1 text-center font-semibold min-h-[28px]">{row.total}</div> : <input type="number" readOnly className="w-full h-full p-1 outline-none text-center bg-transparent font-semibold" 
                      value={row.total} />}
                  </td>
                  <td className="border border-border-excel p-0">
                    {disabled ? <div className="p-1 text-center min-h-[28px]">{row.filledSaleable}</div> : <input type="number" min="0" className="w-full h-full p-1 outline-none text-center" 
                      value={row.filledSaleable} onChange={(e) => handleInputChange(idx, 'filledSaleable', e.target.value)} />}
                  </td>
                  <td className="border border-border-excel p-0">
                    {disabled ? <div className="p-1 text-center min-h-[28px]">{row.fillingWastage}</div> : <input type="number" min="0" className="w-full h-full p-1 outline-none text-center" 
                      value={row.fillingWastage} onChange={(e) => handleInputChange(idx, 'fillingWastage', e.target.value)} />}
                  </td>
                  <td className="border border-border-excel p-0">
                    {disabled ? <div className="p-1 text-center min-h-[28px]">{row.packingWastage}</div> : <input type="number" min="0" className="w-full h-full p-1 outline-none text-center" 
                      value={row.packingWastage} onChange={(e) => handleInputChange(idx, 'packingWastage', e.target.value)} />}
                  </td>
                  <td className="border border-border-excel p-0 bg-gray-100">
                    {disabled ? <div className="p-1 text-center font-semibold min-h-[28px]">{row.closingBalance}</div> : <input type="number" readOnly className="w-full h-full p-1 outline-none text-center bg-transparent font-semibold" 
                      value={row.closingBalance} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
