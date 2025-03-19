import pc from 'picocolors'
import { question } from 'readline-sync'

import { DATAFILES, IGNORE, SOURCES, MONTHS, MULTIMEDIA, REGEX, sourceNames } from './models/consts.js'
import { evaluateUser, loadDDBB } from './services/DDBB.js'
import { iterateFolder } from './controllers/iterators.js'
import { saveToCache } from './services/cache.js'
import { getFileData } from './services/PDF.js'
import { reviewCache } from './services/cache.js'

async function startApp() {
	try {
		question(
			`${pc.red('IMPORTANTE!:')}\n` + `Asegurate de tener ${pc.green('cerrados todos los PDF y el Excel de Estadisticas')} y presiona Enter`
		)
		console.clear()

		await reviewCache()
		const PromiseDdbb = loadDDBB(DATAFILES)

		const PromiseFiles = iterateFolder(MULTIMEDIA)
		let [ddbb, files] = await Promise.all([PromiseDdbb, PromiseFiles])

		console.log('Controlando nombre y fechas de archivos...')
		for (let file of files) {
			const pdfData = await getFileData(file)
			await saveToCache(pdfData)
			// console.log(pdfData)
			const user = await evaluateUser({ link: pdfData.url, user: pdfData.source, sourceData: ddbb[sourceNames[pdfData.sourceType]] })
			const data = {
				user,
				...pdfData,
			}
			console.log(data)
			//! Cuando ya se cargue a la base de datos, se debe borrar del cache

			// await eraseFromCache(file)
		}

		//TODO ADD to DDBB, Move Files to Folder, ADD TO XLSX, Remove from Cache
	} catch (err) {
		console.error(pc.red('Ha surgido un error y no pudo finalizarse la carga'))
		console.error(err)
	}
}

console.log(`Node.js version: ${process.version}`)
await startApp()
