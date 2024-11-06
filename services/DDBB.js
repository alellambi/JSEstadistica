import fs from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { FileError } from '../errors.js'

export async function loadDDBB(datafiles) {
	const ddbb = {}
	const readJsonPromises = datafiles.map(async (file) => {
		try {
			const filePath = path.join(cwd(), '..', 'data', `${file}.json`)

			const fileData = await fs.readFile(filePath)
			ddbb[file] = JSON.parse(fileData)
		} catch (err) {
			throw new FileError(`No pudo encontrarse el archivo ${err.path} al cargar las Bases de Datos`)
		}
	})

	await Promise.all(readJsonPromises)
	return ddbb
}
