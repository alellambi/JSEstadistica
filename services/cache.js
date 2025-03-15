import pc from 'picocolors'
import fs from 'node:fs/promises'
const file = 'cache.json'

export async function saveToCache(pdfData) {
	try {
		let cache = []
		try {
			await ensureFileExists(file)
			const data = await fs.readFile('cache.json', 'utf-8')
			cache = JSON.parse(data)
		} catch (err) {
			console.log('No se pudo leer el archivo cache.json, se creará uno nuevo.')
		}
		cache.push(pdfData)
		await fs.writeFile('cache.json', JSON.stringify(cache, null, 2))
		console.log('Guardado en cache.json')
	} catch (err) {
		console.error(pc.red('No se pudo guardar en cache.json'))
		console.error(err)
	}
}

async function ensureFileExists(file) {
	try {
		await fs.access(file)
	} catch (err) {
		// El archivo no existe, así que lo creamos
		await fs.writeFile(file, '[]')
		console.log(`Archivo ${file} creado`)
	}
}

export async function readCache() {
	const file = 'cache.json'
	try {
		await ensureFileExists(file)
		let data = await fs.readFile(file, 'utf-8')
		if (data === '') {
			await fs.writeFile(file, '[]')
			data = '[]'
		}
		return JSON.parse(data)
	} catch (err) {
		console.error(pc.red(`No se pudo leer el archivo ${file}`))
		console.error(err)
	}
}

export async function eraseFromCache(file) {
	const cache = await readCache()
	const newCache = cache.filter((pdf) => pdf.file !== file)
	await fs.writeFile('cache.json', JSON.stringify(newCache, null, 2))
}
