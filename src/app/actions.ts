"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function submitOperationLog(formData: any, materials: any[]) {
  try {
    const session = await getSession()
    if (!session || !session.supervisorId) {
      return { success: false, error: 'Unauthorized. Please login first.' }
    }
    const {
      productionDate,
      machineLine,
      operator,
      startingTime,
      endTime,
      totalRunHours,
      batchCode,
      fillingTankNo,
      batchQty,
      remarks,
      skuName,
      packedQty,
      fillingWastage,
      packingWastage
    } = formData

    // Find Master Data IDs
    const line = await prisma.lineMaster.findUnique({ where: { lineName: machineLine } })
    const opr = await prisma.operatorMaster.findUnique({ where: { operator: operator } })
    const sku = await prisma.sKUMaster.findUnique({ where: { productDescription: skuName } })

    if (!line || !opr || !sku) {
      return { success: false, error: 'Master data missing for selected options.' }
    }

    // Create OperationLog with MaterialUsages
    const operationLog = await prisma.operationLog.create({
      data: {
        supervisorId: session.supervisorId,
        productionDate: new Date(productionDate),
        startingTime,
        endTime,
        totalRunHours: totalRunHours ? parseFloat(totalRunHours) : null,
        batchCode,
        fillingTankNo,
        batchQty: batchQty ? parseFloat(batchQty) : null,
        remarks,
        documentNumber: 'DCL-SCF-01',
        packedQty: packedQty ? parseFloat(packedQty) : null,
        fillingWastage: fillingWastage ? parseFloat(fillingWastage) : null,
        packingWastage: packingWastage ? parseFloat(packingWastage) : null,
        lineId: line.id,
        operatorId: opr.id,
        skuId: sku.id,
        materialUsages: {
          create: await Promise.all(materials.map(async (mat: any) => {
            const materialItem = await prisma.materialItem.findUnique({ where: { itemName: mat.itemKind } })
            return {
              openingBalance: mat.openingBalance ? parseFloat(mat.openingBalance) : null,
              receivedFromStore: mat.receivedFromStore ? parseFloat(mat.receivedFromStore) : null,
              total: mat.total ? parseFloat(mat.total) : null,
              filledSaleable: mat.filledSaleable ? parseFloat(mat.filledSaleable) : null,
              fillingWastage: mat.fillingWastage ? parseFloat(mat.fillingWastage) : null,
              packingWastage: mat.packingWastage ? parseFloat(mat.packingWastage) : null,
              closingBalance: mat.closingBalance ? parseFloat(mat.closingBalance) : null,
              materialItemId: materialItem ? materialItem.id : -1 // Requires valid item
            }
          })).then(results => results.filter(r => r.materialItemId !== -1))
        }
      }
    })

    revalidatePath('/')
    return { success: true, data: operationLog }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to submit operation log.' }
  }
}
