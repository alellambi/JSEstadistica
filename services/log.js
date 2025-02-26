import fs from 'node:fs/promises'

export function toLog(action, data) {
	const now = new Date()
	const timestamp = now.toISOString() // Formato ISO 8601
	const log = `[${timestamp}] ${action}: ${JSON.stringify(data)}`
	registerLog(log)
}

function registerLog(log) {
	fs.appendFile('log.txt', '\n' + log + '\n')
}
