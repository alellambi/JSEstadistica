import * as XLSX from 'xlsx'

function readXLSX(file) {
	const workbook = XLSX.readFile(file)
}
