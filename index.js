import fs from 'node:fs/promises'
import path from 'node:path'
import pc from 'picocolors'
import { question } from 'readline-sync'

import { FileError } from './errors.js'
import { DATAFILES, IGNORE, SOURCES, MONTHS, MULTIMEDIA, REGEX } from './consts.js'

async function loadDDBB(datafiles = DATAFILES) {
	const ddbb = {}
	const readJsonPromises = datafiles.map(async (file) => {
		try {
			const fileData = await fs.readFile(`../data/${file}.json`)
			ddbb[file] = JSON.parse(fileData)
		} catch (err) {
			throw new FileError(`No pudo encontrarse el archivo ${err.path}`)
		}
	})

	await Promise.all(readJsonPromises)
	return ddbb
}

async function iterateFolder() {
	try {
		const content = await fs.readdir('../Explotaciones')
		const files = content.filter((file) => MULTIMEDIA.includes(path.extname(file)))
		return files
	} catch (err) {
		throw new FileError(`No pudo encontrarse el archivo ${err.path}`)
	}
}

async function validateAndChangeFileName(files) {
	const validated = []
	files.forEach((name) => {
		const match = name.match(REGEX)
		if (match) {
			validated.push(name)
		} else if (name.startsWith('DUPLICADO')) return
		else {
			askValidName(name).then((newName) => {
				try {
					fs.rename(`../Explotaciones/${name}`, `../Explotaciones/${newName}`)
					validated.push(newName)
				} catch (err) {
					console.error(err)
				}
			})
		}
	})
	return validated
}

async function askValidName(name) {
	let newName = String(name)
	do {
		newName = question(
			`La fecha estaba mal ingresada (${pc.red(newName)}).\n` +
				'Comproba cual es la fecha de la explotacion y escribila siguiendo el formato establecido DDMMMYY.\n' +
				'FECHA: '
		)
	} while (!newName.match(REGEX))
	if (name.includes('-')) {
		const [date, ...file] = name.split('-')
		return `${newName} - ${file.join('').trim()}`
	} else {
		return `${newName} - ${name}`
	}
}

async function startApp() {
	try {
		const PromiseDdbb = loadDDBB(DATAFILES)
		const PromiseFiles = iterateFolder()
		let [ddbb, files] = await Promise.all([PromiseDdbb, PromiseFiles])
		files = await validateAndChangeFileName(files)
		//TODO ADD to DDBB, ADD to Cache, Move Files to Folder, ADD TO XLSX
	} catch (err) {
		console.error(err)
	}
}

startApp()
