import { SOURCES } from '../consts.js'
import { handlers } from './links.js'

export async function getSource(url) {
	let domain = await classifySource(url)
	let sourceType, source
	console.log(domain)
	for (const src in SOURCES) {
		if (SOURCES[src].includes(domain)) {
			sourceType = src ?? undefined
			break
		}
	}
	if (!sourceType) {
		source = domain
		sourceType = 'Medios'
	} else {
		source = await getUser(url, sourceType)
	}

	return { sourceType, source }
}

async function classifySource(url) {
	const source = url.match(/https?:\/\/(?:www\.)?([^\/.]+)/)[1]
	return source
}

async function getUser(url, sourceType) {
	const handler = handlers[sourceType]
	if (!handler) return undefined
	const match = url.match(/https?:\/\/(?:www\.)?[^\/]+\/([^\/]+)(?:\/([^\/]+))?/)
	if (!match) return undefined
	const user = await handler(url, match)
	console.log('\t', url)
	console.log('\t', user)
	return user
}

console.log(
	await getSource(
		'https://www.infobae.com/judiciales/2024/10/05/causa-polo-obrero-la-unidad-de-informacion-financiera-acuso-a-belliboni-por-lavado-de-dinero/'
	)
)
console.log(await getSource('https://www.facebook.com/photo/?fbid=10234958116429696&set=gm.28764994099814191&idorvanity=297705810303067'))
console.log(await getSource('https://www.facebook.com/reel/1162692718744228'))
console.log(
	await getSource('https://www.facebook.com/stories/101197508717011/UzpfSVNDOjY4MTAwNTg1NzgyOTA3Mg==/?bucket_count=9&source=story_tray')
)
console.log(await getSource('https://www.instagram.com/stories/asambleapaternal/'))
console.log(await getSource('https://www.instagram.com/p/DHO8FfwvQGP/'))
