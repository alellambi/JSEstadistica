import fs from 'node:fs/promises'
import path from 'node:path'
import pc from 'picocolors'
import { question } from 'readline-sync'

import { DATAFILES, IGNORE, SOURCES, MONTHS, MULTIMEDIA, REGEX } from './consts.js'
import { loadDDBB } from './services/DDBB.js'
import { iterateFolder } from './controllers/iterators.js'
import { validateAndChangeFileName } from './models/nameCheckers.js'

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
		files = await validateAndChangeFileName(files, REGEX)

		//TODO READ PDF, ADD to DDBB, ADD to Cache, Move Files to Folder, ADD TO XLSX
	} catch (err) {
		console.error(pc.red('Ha surgido un error y no pudo finalizarse la carga'))
		console.error(err)
	}
}

startApp()
