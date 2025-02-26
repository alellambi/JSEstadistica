export const DATAFILES = ['Fb', 'Tw', 'Ig', 'Web', 'Total']
export const IGNORE = ['Agregados a Estadistica', 'Thumbs.db', 'desktop.ini', '.gitignore']
export const SOURCES = {
	Facebook: [
		' https://www.facebook.com/',
		'https://www.facebook.com/',
		' https://m.facebook.com/',
		'http://m.facebook.com/',
		'https://facebook.com/',
		' https://facebook.com/',
		'facebook.com',
		'https://web.facebook.com/',
		'facebook',
	],
	Twitter: [
		' https://www.twitter.com/',
		'https://www.twitter.com/',
		' https://m.twitter.com/',
		'http://m.twitter.com/',
		'https://twitter.com/',
		' https://twitter.com/',
		'twitter.com/',
		'https://mobile.twitter.com',
		'http://mobile.twitter.com',
		'https://x.com',
		'twitter',
		'x',
	],
	Instagram: [
		' https://www.instagram.com/',
		'https://www.instagram.com/',
		' https://m.instagram.com/',
		'http://m.instagram.com/',
		'https://instagram.com/',
		' https://instagram.com/',
		'instagram',
	],
}
export const MONTHS = {
	ENE: ['Enero', '01'],
	FEB: ['Febrero', '02'],
	MAR: ['Marzo', '03'],
	ABR: ['Abril', '04'],
	MAY: ['Mayo', '05'],
	JUN: ['Junio', '06'],
	JUL: ['Julio', '07'],
	AGO: ['Agosto', '08'],
	SEP: ['Septiembre', '09'],
	OCT: ['Octubre', '10'],
	NOV: ['Noviembre', '11'],
	DIC: ['Diciembre', '12'],
}
export const MULTIMEDIA = ['.pdf', '.jpeg', '.jpg', '.m4v', '.mp4', '.mp3', '.png', '.wav', '.wma', '.mpeg', '.ogg', '.mkv']
export const YEAR = new Date().getFullYear().toString().slice(-2)
export const REGEX = new RegExp(`^(0[1-9]|[12][0-9]|3[01])(${Object.keys(MONTHS).join('|')})(?:${YEAR}|${YEAR - 1})(\\s*-+)?`, 'i')
