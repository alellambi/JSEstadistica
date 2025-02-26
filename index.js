import pc from 'picocolors'
import fs from 'node:fs/promises'
import { question } from 'readline-sync'

import { DATAFILES, IGNORE, SOURCES, MONTHS, MULTIMEDIA, REGEX } from './consts.js'
import { loadDDBB } from './services/DDBB.js'
import { iterateFolder } from './controllers/iterators.js'
import { validateAndChangeFileName } from './models/nameCheckers.js'
import { readPDF, getSource as getSourceURL, getDate } from './services/PDF.js'
import { saveToCache, readCache, eraseFromCache } from './services/cache.js'
import { toLog } from './services/log.js'

async function startApp() {
	try {
		question(
			`${pc.red('IMPORTANTE!:')}\n` + `Asegurate de tener ${pc.green('cerrados todos los PDF y el Excel de Estadisticas')} y presiona Enter`
		)
		console.clear()
		console.log('Revisando Caché...')
		const cache = await readCache()
		if (cache.length > 0) {
			toLog('Se han encontrado archivos en el caché', cache)
			for (let elem of cache) {
				//! Aquí se debe cargar a la base de datos
				console.log(`Guardando ${elem.file} en la base de datos`)
				eraseFromCache(elem.file).then(() => {
					console.log(`Eliminando ${elem.file} del caché`)
				})
			}
			toLog('Se han cargado los archivos del caché a la base de datos', `${cache.length} elementos`)
		}
		console.log('Cargando Base de datos...')
		const PromiseDdbb = loadDDBB(DATAFILES)

		console.log('Cargando archivos de explotacion...')
		const PromiseFiles = iterateFolder(MULTIMEDIA)
		let [_, files] = await Promise.all([PromiseDdbb, PromiseFiles])

		console.log('Controlando nombre y fechas de archivos...')
		for (let file of files) {
			file = await validateAndChangeFileName(file, REGEX)
			const date = getDate(file)
			const pdf = await readPDF(file)
			const url = await getSourceURL(pdf)
			// const {sourceType, source} = await getSource(data)

			const pdfData = {
				file: file,
				sourceType: sourceType,
				source: source,
				date: date,
			}
			await saveToCache(pdfData)
			console.log(pdfData)

			//! Cuando ya se cargue a la base de datos, se debe borrar del cache
			// await eraseFromCache(file)
		}

		//TODO ADD to DDBB, Move Files to Folder, ADD TO XLSX, Remove from Cache
	} catch (err) {
		console.error(pc.red('Ha surgido un error y no pudo finalizarse la carga'))
		console.error(err)
	}
}

startApp()
