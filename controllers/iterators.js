import fs from 'node:fs/promises'

import { MULTIMEDIA } from '../consts.js'
import { FileError } from '../errors.js'

export async function iterateFolder(MULTIMEDIA) {
	try {
		const content = await fs.readdir('../Explotaciones')
		const files = content.filter((file) => MULTIMEDIA.includes(path.extname(file)))
		return files
	} catch (err) {
		throw new FileError(`No pudo encontrarse el archivo ${err.path} al iterar la carpeta`)
	}
}
