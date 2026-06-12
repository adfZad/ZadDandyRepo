import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Master Data...')

  const skuMasterPath = path.resolve(__dirname, '../../SKU&Operator Master.xlsx')
  const labanPath = path.resolve(__dirname, '../../Laban Sharab 1.xlsx')

  const skuWorkbook = xlsx.readFile(skuMasterPath)
  
  // 1. SKU & Line Master
  const skuSheet = skuWorkbook.Sheets['SKU & Line Master']
  const skuData: any[] = xlsx.utils.sheet_to_json(skuSheet, { defval: null })
  
  for (const row of skuData) {
    const lineName = row['Line']
    const productDesc = row['Product Description']
    const uom = row['UOM']
    const code = row['__EMPTY']

    let lineId = null
    if (lineName) {
      const line = await prisma.lineMaster.upsert({
        where: { lineName },
        update: {},
        create: { lineName }
      })
      lineId = line.id
    }

    if (productDesc) {
      await prisma.sKUMaster.upsert({
        where: { productDescription: productDesc },
        update: { lineId },
        create: { 
          productDescription: productDesc,
          uom: uom || 'PC',
          code: code || null,
          lineId
        }
      })
    }
  }

  // 2. Operators & Supervisors
  const operatorSheet = skuWorkbook.Sheets['Operator & Sup List']
  const operatorData: any[] = xlsx.utils.sheet_to_json(operatorSheet, { defval: null })
  
  for (const row of operatorData) {
    const operator = row['Operator']
    const supervisor = row['Supervisor']

    if (operator && typeof operator === 'string' && operator.trim() !== '') {
      await prisma.operatorMaster.upsert({
        where: { operator: operator.trim() },
        update: {},
        create: { operator: operator.trim() }
      })
    }

    if (supervisor && typeof supervisor === 'string' && supervisor.trim() !== '') {
      // Create supervisor with a default password "123456" (not securely hashed for this demo, usually we'd bcrypt it)
      await prisma.supervisorMaster.upsert({
        where: { supervisorName: supervisor.trim() },
        update: {},
        create: { 
          supervisorName: supervisor.trim(),
          passwordHash: '123456' // Default password for everyone
        }
      })
    }
  }

  // 3. Materials
  const labanWorkbook = xlsx.readFile(labanPath)
  const labanSheet = labanWorkbook.Sheets['Laban sharab 1 ok']
  const labanData: any[][] = xlsx.utils.sheet_to_json(labanSheet, { header: 1 })
  
  let startIndex = -1
  for (let i = 0; i < labanData.length; i++) {
    if (labanData[i][0] === 'Item / Kind') {
      startIndex = i + 1
      break
    }
  }

  // Clean up mistakenly added invalid rows from previous seeds
  const invalidRows = ['Date Coding Cross Verific', 'Operator', 'Document Control Block']
  for (const invalid of invalidRows) {
    await prisma.materialItem.deleteMany({
      where: { itemName: { contains: invalid } }
    })
  }

  if (startIndex !== -1) {
    for (let i = startIndex; i < labanData.length; i++) {
      const itemName = labanData[i][0]
      if (itemName && typeof itemName === 'string' && itemName.trim() !== '') {
        const cleanName = itemName.trim()
        if (invalidRows.some(ex => cleanName.includes(ex))) {
          continue
        }
        await prisma.materialItem.upsert({
          where: { itemName: cleanName },
          update: {},
          create: { itemName: cleanName }
        })
      }
    }
  }

  // 4. Map Materials to SKUs via Keyword Heuristic and Add Dummy Materials
  console.log('Mapping materials to SKUs and generating dummy materials...')
  const allSkus = await prisma.sKUMaster.findMany()
  const allMaterials = await prisma.materialItem.findMany()

  // First map the existing ones from Laban sheet
  for (const mat of allMaterials) {
    const matName = mat.itemName.toLowerCase()
    let matchedSkuId = null

    const keywords = ['mango', 'strawberry', 'peach', 'apricot', 'mint', 'zeera', 'lassi', 'airan']
    let foundKeyword = keywords.find(kw => matName.includes(kw))
    
    if (foundKeyword) {
      const sku = allSkus.find(s => s.productDescription.toLowerCase().includes(foundKeyword!))
      if (sku) matchedSkuId = sku.id
    } else if (matName.includes('sharab')) {
       const sku = allSkus.find(s => s.productDescription.toLowerCase().includes('sharab'))
       if (sku) matchedSkuId = sku.id
    } else {
       matchedSkuId = allSkus[0]?.id
    }

    if (matchedSkuId) {
      await prisma.materialItem.update({
        where: { id: mat.id },
        data: { skuId: matchedSkuId }
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
