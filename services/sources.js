import { SOURCES } from '../consts.js'

export async function getSource(url) {
	let domain = await classifySource(url)
	let sourceType, source
	console.log(domain)
	for (const src in SOURCES) {
		if (SOURCES[src].includes(domain)) {
			sourceType = src
			break
		}
	}
	if (!sourceType) {
		source = domain
		sourceType = 'Medios'
	}

	return { sourceType, source }
}

async function classifySource(url) {
	const source = url.match(/https?:\/\/(?:www\.)?([^\/.]+)/)[1]
	return source
}

async function getUser(url, sourceType) {
	if (sourceType === 'Twitter') {
		return url.match(/https?:\/\/(?:www\.)?twitter\.com\/([^\/?]+)/)[1]
	}
}

console.log(
	await getSource(
		'https://www.infobae.com/judiciales/2024/10/05/causa-polo-obrero-la-unidad-de-informacion-financiera-acuso-a-belliboni-por-lavado-de-dinero/'
	)
)
console.log(
	await getSource(
		'https://www.facebook.com/permalink.php?story_fbid=pfbid031zmhaVYLuNbAWKAi8bk2hd8G7CgSwSymqhfXcstkTdLumixonATFeGc4Q2stb2PFl&id=100067904332891'
	)
)
console.log(await getSource('https://www.instagram.com/stories/asambleapaternal/'))
console.log(await getSource('https://www.twitter.com/AsambleaPaternal/status/1445748722824334336'))
