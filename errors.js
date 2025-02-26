import { toLog } from './services/log.js'
function createErrorFactory(name) {
	return class BusinessError extends Error {
		constructor(message) {
			toLog('ERROR', message)
			super(message)
			this.name = name
			this.stack = ''
		}
	}
}

export const FileError = createErrorFactory('FileError')
