import pc from 'picocolors'

export async function validateAndChangeFilesNames(files, REGEX) {
	const validated = []
	files.forEach((name) => {
		const match = name.match(REGEX)
		if (match) {
			validated.push(name)
		} else if (name.startsWith('DUPLICADO')) return
		else {
			askValidName(name, REGEX).then((newName) => {
				try {
					fs.rename(`../Explotaciones/${name}`, `../Explotaciones/${newName}`)
					validated.push(newName)
				} catch (err) {
					console.error(err)
				}
			})
		}
	})
	return validated
}
export async function validateAndChangeFileName(name, REGEX) {
	const match = name.match(REGEX)
	if (match) {
		return name
	} else if (name.startsWith('DUPLICADO')) return
	else {
		askValidName(name, REGEX).then((newName) => {
			try {
				fs.rename(`../Explotaciones/${name}`, `../Explotaciones/${newName}`)
				return newName
			} catch (err) {
				console.error(err)
			}
		})
	}
}

async function askValidName(name, REGEX) {
	let newName = String(name)
	do {
		newName = question(
			`La fecha estaba mal ingresada (${pc.red(newName)}).\n` +
				'Comproba cual es la fecha de la explotacion y escribila siguiendo el formato establecido DDMMMYY.\n' +
				'FECHA: '
		)
	} while (!newName.match(REGEX))
	if (name.includes('-')) {
		const [date, ...file] = name.split('-')
		return `${newName} - ${file.join('').trim()}`
	} else {
		return `${newName} - ${name}`
	}
}
