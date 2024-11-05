function createErrorFactory(name) {
	return class BusinessError extends Error {
		constructor(message) {
			super(message)
			this.name = name
			this.stack = ''
		}
	}
}

export const FileError = createErrorFactory('FileError')
