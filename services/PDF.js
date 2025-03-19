import fs from 'node:fs/promises'
import path from 'node:path'
import pkg from 'pdfjs-dist/legacy/build/pdf.js'
const { getDocument } = pkg

import { getSource } from './sources.js'
import { MONTHS } from '../models/consts.js'
import { validateAndChangeFileName } from '../models/nameCheckers.js'
import { REGEX } from '../models/consts.js'

export async function readPDF(file) {
	const filePath = path.resolve('..', 'Explotaciones', file)

	try {
		const dataBuffer = await fs.readFile(filePath)
		const pdfData = new Uint8Array(dataBuffer)
		const loadingTask = getDocument({
			data: pdfData,
			standardFontDataUrl: path.join(import.meta.dirname, '..', 'node_modules/pdfjs-dist/standard_fonts/'),
		})
		const pdf = await loadingTask.promise

		return pdf // 📌 Retorna el pdf
	} catch (err) {
		console.error('❌ Error al leer el PDF:', err.message)
		return null
	}
}

// 🔍 Función para extraer la primera "FUENTE: https://..."
export async function getURL(pdf) {
	const page = await pdf.getPage(1)
	const annotations = await page.getAnnotations()

	for (const annot of annotations) {
		if (annot.subtype === 'Link' && annot.url) {
			return annot.url
		}
	}
	const textContent = await page.getTextContent()
	const url = textContent.items[0].str
	if (url.includes('boletinoficial')) return 'https://www.boletinoficial.gob.ar/'
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

export async function getFileData(file) {
	file = await validateAndChangeFileName(file, REGEX)
	const month = MONTHS[file.slice(2, 5)][0]
	const date = getDate(file)
	const pdf = await readPDF(file)
	const url = await getURL(pdf)
	const { sourceType, source } = await getSource(url)

	const pdfData = {
		file: file,
		month,
		url: url,
		date,
		sourceType: sourceType,
		source: source,
	}

	return pdfData
}
