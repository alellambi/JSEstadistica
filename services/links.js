import pc from 'picocolors'
import { question } from 'readline-sync'
import open from 'open'

async function openLink(url, defaultName) {
	await open(url)
	return question(`Ingresa el nombre de la fuente: `) || defaultName
}

export async function askToOpen(url, defaultName) {
	const awnser = question(
		`Ingresa "A" o "Abrir" para abrir el link ${pc.blue(
			`${url}`
		)}\nO escribe el nombre con el que desees agendarlo. \nPresiona Enter para cargarlo con el nombre "${pc.red(`${defaultName}`)}"\n`
	)
	if (awnser.toLowerCase() === 'a' || awnser.toLowerCase() === 'abrir') {
		return openLink(url, defaultName)
	} else if (!awnser) return defaultName
	return awnser
}

async function handleFacebook(url, match) {
	// Caso Permalink
	if (match[1].startsWith('permalink.php')) {
		const id = match[1].match(/id=(\d+)/)
		return id[1] || undefined
		// Caso Grupos
	} else if (match[1] === 'groups' && match[2]) {
		return match[2] || undefined
		// Caso Fotos
	} else if (match[1] === 'photo') {
		const id = match[2].match(/idorvanity=(\d+)/)
		return id[1] || undefined
		// Caso Reels
	} else if (match[1] === 'reel') {
		console.log('La Explotacion es un reel, se debe corregir')
		return askToOpen(url, match[2])
	}
	return match[1] || undefined
}

async function handleInstagram(url, match) {
	// Caso Stories
	if (match[1] === 'stories' && match[2]) {
		return match[2] || undefined
	}
	// Caso Post
	if (match[1] === 'p' && match[2]) {
		console.log('Explotacion mal cargada')
		return askToOpen(url, match[2])
	}
	return match[1] || undefined
}

async function handleTwitter(url, match) {
	return match[1] || undefined
}

async function handleTikTok(url, match) {
	return match[1] || undefined
}

export const handlers = {
	FACEBOOK: handleFacebook,
	INSTAGRAM: handleInstagram,
	TWITTER: handleTwitter,
	TIKTOK: handleTikTok,
}
