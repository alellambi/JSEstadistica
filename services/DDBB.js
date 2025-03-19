import fs from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { FileError } from '../models/errors.js'
import { askToOpen } from './links.js'

export async function loadDDBB(datafiles) {
	console.log('Cargando Base de datos...')
	const ddbb = {}
	const readJsonPromises = datafiles.map(async (file) => {
		try {
			const filePath = path.join(cwd(), '..', 'data', `${file}.json`)

			const fileData = await fs.readFile(filePath)
			try {
				ddbb[file] = JSON.parse(fileData)
			} catch (parseErr) {
				throw new FileError(`Error al parsear el archivo ${file}: ${parseErr.message}`)
			}
		} catch (err) {
			throw new FileError(`No pudo encontrarse el archivo ${err.path || 'unknown path'} al cargar las Bases de Datos`)
		}
	})

	await Promise.all(readJsonPromises)
	return ddbb
}

export async function evaluateUser({ link, user, sourceData }) {
	// TODO! Terminar
	let userSource = sourceData[user]
	if (userSource) {
		console.log(userSource)
		return userSource
	} else {
		console.log(`\n❗❗No se encontro el usuario ${user} en la base de datos`)
		userSource = askToOpen(link, user)
		sourceData[user] = userSource
		return userSource
	}
}
