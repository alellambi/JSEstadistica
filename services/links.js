import pc from 'picocolors'
import { question } from 'readline-sync'
import open from 'open'

async function handleFacebook(url, match) {
	if (match[1].startsWith('permalink.php')) {
		const id = match[1].match(/id=(\d+)/)
		return id[1] || undefined
	} else if (match[1] === 'groups' && match[2]) {
		return match[2] || undefined
	} else if (match[1] === 'photo') {
		const id = match[2].match(/idorvanity=(\d+)/)
		return id[1] || undefined
	} else if (match[1] === 'reel') {
		console.log('La Explotacion es un reel, se debe corregir')
		const newName = openLink(url, match[2])
		return newName
	}
	return match[1] || undefined
}

async function handleInstagram(url, match) {
	if (match[1] === 'stories' && match[2]) {
		return match[2] || undefined
	}
	if (match[1] === 'p' && match[2]) {
		console.log('Explotacion mal cargada')
		const newName = openLink(url, match[2])
		return newName
	}
	return match[1] || undefined
}

async function handleTwitter(url, match) {
	return match[1] || undefined
}

async function handleTikTok(url, match) {
	return match[1] || undefined
}
async function openLink(url, defaultName) {
	const awnser = question(
		`Ingresa "A" o "Abrir" para abrir el link ${pc.blue(`${url}`)}\nO presiona Enter para cargarlo con el nombre "${pc.red(
			`${defaultName}`
		)}"\n`
	)
	if (awnser.toLowerCase() === 'a' || awnser.toLowerCase() === 'abrir') {
		await open(url)
		return question(`Ingresa el nombre de la fuente: `) || defaultName
	} else return defaultName
}
export const handlers = {
	Facebook: handleFacebook,
	Instagram: handleInstagram,
	Twitter: handleTwitter,
	TikTok: handleTikTok,
}
