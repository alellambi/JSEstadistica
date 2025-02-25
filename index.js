import fs from 'node:fs/promises'
import path from 'node:path'
import pc from 'picocolors'
import { question } from 'readline-sync'

import pkg from 'pdfjs-dist/legacy/build/pdf.js'
const { getDocument } = pkg
import { DATAFILES, IGNORE, SOURCES, MONTHS, MULTIMEDIA, REGEX } from './consts.js'
import { loadDDBB } from './services/DDBB.js'
import { iterateFolder } from './controllers/iterators.js'
import { validateAndChangeFilesNames, validateAndChangeFileName } from './models/nameCheckers.js'
import { cwd } from 'node:process'

async function readPDF(file, onlyFirstPage = true) {
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
async function getSource(pdf) {
	const page = await pdf.getPage(1)
	const annotations = await page.getAnnotations()

	for (const annot of annotations) {
		if (annot.subtype === 'Link' && annot.url) {
			return annot.url
		}
	}
	return 'FUENTE NO ENCONTRADA'
}

function getDate(file) {
	const match = file.match(/^(.+?)\s*-/)
	const date = match ? match[1].trim() : null
	const day = date.slice(0, 2)
	const month = MONTHS[date.slice(2, 5)][1]
	const year = date.slice(-2)
	return `${day}/${month}/20${year}`
}

async function startApp() {
	try {
		question(
			`${pc.red('IMPORTANTE!:')}\n` + `Asegurate de tener ${pc.green('cerrados todos los PDF y el Excel de Estadisticas')} y presiona Enter`
		)
		console.clear()

		console.log('Cargando Base de datos...')
		const PromiseDdbb = loadDDBB(DATAFILES)

		console.log('Cargando archivos de explotacion...')
		const PromiseFiles = iterateFolder(MULTIMEDIA)
		let [_, files] = await Promise.all([PromiseDdbb, PromiseFiles])

		console.log('Controlando nombre y fechas de archivos...')
		for (let file of files) {
			file = await validateAndChangeFileName(file, REGEX)
			const date = getDate(file)
			const pdf = await readPDF(file) // Añadir await aquí
			const data = await getSource(pdf) // Añadir await aquí
			const pdfData = {
				file: file,
				source: data,
				date: date,
			}
			console.log(pdfData)
		}
		// files = await validateAndChangeFilesNames(files, REGEX)

		//TODO READ PDF, ADD to DDBB, ADD to Cache, Move Files to Folder, ADD TO XLSX
	} catch (err) {
		console.error(pc.red('Ha surgido un error y no pudo finalizarse la carga'))
		console.error(err)
	}
}

startApp()
