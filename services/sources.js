import { SOURCES } from '../models/consts.js'
import { handlers } from './links.js'

export async function getSource(url) {
	let domain = await classifySource(url)
	if (domain == 'www.boltinoficial.gob.ar') return { sourceType: 'BOLETIN OFICIAL', source: 'BOLETIN OFICIAL' }
	let sourceType, source
	for (const src in SOURCES) {
		if (SOURCES[src].includes(domain)) {
			sourceType = src.toUpperCase() ?? undefined
			break
		}
	}
	if (!sourceType) {
		// source = domain.match(/(?:www\.)?([^\.]+)(?:\.com)?/)[1]
		source = domain
		sourceType = 'MEDIOS'
	} else {
		source = await getUser(url, sourceType)
	}

	return { sourceType, source }
}

async function classifySource(url) {
	const source = url.match(/^(?:https?:\/\/)?((?:www\.)?[^\/]+)/)[1]
	return source
}

async function getUser(url, sourceType) {
	const handler = handlers[sourceType]
	if (!handler) return undefined
	const match = url.match(/https?:\/\/(?:www\.)?[^\/]+\/([^\/]+)(?:\/([^\/]+))?/)
	if (!match) return undefined
	const user = await handler(url, match)
	return user.toLowerCase()
}
