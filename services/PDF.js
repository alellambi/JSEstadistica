import fs from 'node:fs/promises'
import path from 'node:path'
import pkg from 'pdfjs-dist/legacy/build/pdf.js'
const { getDocument } = pkg

import { MONTHS } from '../consts.js'

export async function readPDF(file) {
	const filePath = path.resolve('..', 'Explotaciones', file)

	try {
		const dataBuffer = await fs.readFile(filePath)
		const pdfData = new Uint8Array(dataBuffer)
		const loadingTask = getDocument({ data: pdfData })
		const pdf = await loadingTask.promise

		return pdf // 📌 Retorna el pdf
	} catch (err) {
		console.error('❌ Error al leer el PDF:', err.message)
		return null
	}
}

// 🔍 Función para extraer la primera "FUENTE: https://..."
export async function getSource(pdf) {
	const page = await pdf.getPage(1)
	const annotations = await page.getAnnotations()

	for (const annot of annotations) {
		if (annot.subtype === 'Link' && annot.url) {
			return annot.url
		}
	}
	return 'FUENTE NO ENCONTRADA'
}

export function getDate(file) {
	const match = file.match(/^(.+?)\s*-/)
	const date = match ? match[1].trim() : null
	const day = date.slice(0, 2)
	const month = MONTHS[date.slice(2, 5)][1]
	const year = date.slice(-2)
	return `${day}/${month}/20${year}`
}
