"use client"

import React, { useState } from 'react'
import MaterialsTable from './MaterialsTable'
import { submitOperationLog } from '@/app/actions'

export default function LogForm({ lines, operators, skus, materialItems }: any) {
  const [formData, setFormData] = useState({
    productionDate: '',
    machineLine: '',
    operator: '',
    startingTime: '',
    endTime: '',
    batchCode: '',
    fillingTankNo: '',
    batchQty: '',
    remarks: '',
    skuName: '',
    packedQty: '',
    fillingWastage: '',
    packingWastage: '',
  })

  const [materials, setMaterials] = useState<any[]>([])

  const [loading, setLoading] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.type === 'number' && parseFloat(e.target.value) < 0) return;
    
    // Alphanumeric validation for batch code
    if (e.target.name === 'batchCode') {
      const alphanumericRegex = /^[a-zA-Z0-9]*$/;
      if (!alphanumericRegex.test(e.target.value)) return;
    }

    // If line changes, reset the selected SKU
    if (e.target.name === 'machineLine') {
      setFormData({ ...formData, machineLine: e.target.value, skuName: '' })
      setMaterials([])
      return;
    }

    // If SKU changes, update the materials list
    if (e.target.name === 'skuName') {
      setFormData({ ...formData, skuName: e.target.value })
      const selectedSkuObj = skus.find((s: any) => s.productDescription === e.target.value)
      if (selectedSkuObj) {
        const newMaterials = materialItems
          .filter((item: any) => item.skuId === selectedSkuObj.id)
          .map((item: any) => ({
            itemKind: item.itemName,
            openingBalance: '',
            receivedFromStore: '',
            total: '',
            filledSaleable: '',
            fillingWastage: '',
            packingWastage: '',
            closingBalance: ''
          }))
        setMaterials(newMaterials)
      } else {
        setMaterials([])
      }
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Filter SKUs based on selected Line
  const selectedLineObj = lines.find((l: any) => l.lineName === formData.machineLine);
  const filteredSkus = selectedLineObj 
    ? skus.filter((s: any) => s.lineId === selectedLineObj.id)
    : [];

  const handleReview = () => {
    if (!formData.productionDate || !formData.machineLine || !formData.operator || !formData.skuName) {
      alert("Please fill in required fields: Date, Line, Operator, SKU")
      return
    }
    setIsReviewing(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const result = await submitOperationLog(formData, materials)
    setLoading(false)
    if (result.success) {
      alert("Log Sheet Submitted Successfully!")
      window.location.href = '/logs'
    } else {
      alert("Error: " + result.error)
    }
  }

  return (
    <div className="p-4 text-sm">
      <style>{`
        @media print {
          @page { margin: 0; }
          body { padding-top: 1cm; padding-bottom: 1cm; }
        }
      `}</style>
      
      {/* Title */}
      <div className="grid grid-cols-[120px_auto_120px] items-center mb-4 border-b-2 border-black pb-2 px-2">
        {/* Left Logo */}
        <div className="flex justify-start">
          <img src="/dandy-logo.jpeg" alt="Dandy Logo" className="h-16 print:h-12 w-auto object-contain" />
        </div>
        
        {/* Center Title */}
        <div className="text-center flex flex-col items-center">
          <h1 className="text-xl print:text-base font-bold font-serif tracking-wide">LABAN SHARAB FILLING MACHINE / OPERATION LOG SHEET</h1>
          <span className="font-bold text-lg print:text-sm mt-1">Record No.DCL-SCF-08-01</span>
        </div>
        
        {/* Right Logo (IMS) */}
        <div className="flex justify-end">
          <span className="text-[48px] print:text-[36px] font-bold text-[#d1d5db]" style={{ WebkitTextStroke: '1.5px black', letterSpacing: '2px', lineHeight: 1 }}>IMS</span>
        </div>
      </div>

      {/* Header Grid */}
      <table className="w-full border-collapse border border-border-excel mb-6">
        <tbody>
          <tr>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Production Date</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.productionDate}</div> : <input type="date" name="productionDate" value={formData.productionDate} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Name of Machine (line)</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.machineLine}</div> : <select name="machineLine" value={formData.machineLine} onChange={handleChange} className="w-full outline-none">
                <option value="">Select Line...</option>
                {lines.map((l: any) => (
                  <option key={l.id} value={l.lineName}>{l.lineName}</option>
                ))}
              </select>}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Operator</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.operator}</div> : <select name="operator" value={formData.operator} onChange={handleChange} className="w-full outline-none">
                <option value="">Select Operator...</option>
                {operators.map((o: any) => (
                  <option key={o.id} value={o.operator}>{o.operator}</option>
                ))}
              </select>}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Document Number</td>
            <td className="border border-border-excel p-1">
              <div className="p-1 whitespace-nowrap text-gray-500">DCL-SCF-01</div>
            </td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Starting Time</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.startingTime}</div> : <input type="time" name="startingTime" value={formData.startingTime} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">End Time</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.endTime}</div> : <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Batch Code</td>
            <td className="border border-border-excel p-1" colSpan={3}>
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.batchCode}</div> : <input type="text" name="batchCode" value={formData.batchCode} onChange={handleChange} className="w-full outline-none" />}
            </td>
          </tr>

          {/* Row 3 */}
          <tr>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Filling Tank No</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.fillingTankNo}</div> : <input type="text" name="fillingTankNo" value={formData.fillingTankNo} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Batch Qty</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.batchQty}</div> : <input type="number" min="0" name="batchQty" value={formData.batchQty} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Remarks</td>
            <td className="border border-border-excel p-1" colSpan={3}>
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.remarks}</div> : <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="w-full outline-none" />}
            </td>
          </tr>

          {/* Row 4 */}
          <tr>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">SKU Name</td>
            <td className="border border-border-excel p-1" colSpan={3}>
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.skuName}</div> : <select name="skuName" value={formData.skuName} onChange={handleChange} className="w-full outline-none" required>
                <option value="">Select SKU</option>
                {filteredSkus.map((sku: any) => (
                  <option key={sku.id} value={sku.productDescription}>{sku.productDescription}</option>
                ))}
              </select>}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Packed Qty in Pieces</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.packedQty}</div> : <input type="number" min="0" name="packedQty" value={formData.packedQty} onChange={handleChange} className="w-full outline-none" />}
            </td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Filling Wastage Qty</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.fillingWastage}</div> : <input type="number" min="0" name="fillingWastage" value={formData.fillingWastage} onChange={handleChange} className="w-full outline-none" />}
            </td>
          </tr>
          {/* Row 5 */}
          <tr>
            <td colSpan={6} className="border border-border-excel border-t-0 p-1 bg-white"></td>
            <td className="border border-border-excel bg-header-excel p-1 font-semibold whitespace-nowrap">Packing Material Wastage Qty</td>
            <td className="border border-border-excel p-1">
              {isReviewing ? <div className="p-1 min-h-[28px] break-words">{formData.packingWastage}</div> : <input type="number" min="0" name="packingWastage" value={formData.packingWastage} onChange={handleChange} className="w-full outline-none" />}
            </td>
          </tr>
        </tbody>
      </table>

      <MaterialsTable rows={materials} setRows={setMaterials} disabled={isReviewing} />
      
      {/* Print Only Footer */}
      <div className="hidden print:block mt-12 w-full border-2 border-black text-xs font-bold text-center">
        {/* Signatures */}
        <div className="grid grid-cols-3 border-b-2 border-black">
          <div className="border-r-2 border-black pt-12 pb-1">Operator</div>
          <div className="border-r-2 border-black pt-12 pb-1">Asst. Operator</div>
          <div className="pt-12 pb-1">PRODUCTION SUPERVISOR</div>
        </div>
        {/* Document Control */}
        <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto_1fr] divide-x-2 divide-black bg-white">
          <div className="bg-[#fcd5b4] p-1 px-4">Document Control Block</div>
          <div className="p-1 px-4">Doc. #</div>
          <div className="p-1 px-4">DCL-SCF-08-01</div>
          <div className="p-1 px-4">Rev. #</div>
          <div className="p-1 px-4">12</div>
          <div className="p-1 px-4">Rev. Date</div>
          <div className="p-1 px-4">19-Jun-25</div>
          <div className="p-1"></div>
        </div>
      </div>

      <div className="mt-6 flex justify-end pb-4 space-x-4 print:hidden">
        {isReviewing ? (
          <>
            <button 
              onClick={() => window.print()}
              type="button"
              className="bg-gray-500 text-white px-8 py-2 font-bold hover:bg-gray-600 transition disabled:opacity-50">
              Print
            </button>
            <button 
              onClick={() => setIsReviewing(false)}
              type="button"
              disabled={loading}
              className="bg-gray-500 text-white px-8 py-2 font-bold hover:bg-gray-600 transition disabled:opacity-50">
              Go Back to Edit
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-green-600 text-white px-8 py-2 font-bold hover:bg-green-700 transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Confirm & Submit'}
            </button>
          </>
        ) : (
          <button 
            onClick={handleReview} 
            className="bg-blue-600 text-white px-8 py-2 font-bold hover:bg-blue-700 transition">
            Review Log Sheet
          </button>
        )}
      </div>
    </div>
  )
}
