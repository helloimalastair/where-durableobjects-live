type getColo = (a: string) => string;
const buildData = (colos: getColo, dos: Record<string, number>) =>
	Object.entries(dos)
	.map(a => [colos(a[0]), a[1]])
	.sort((a, b) => (a[0] as string).localeCompare(b[0] as string))
	.map((t) => `<b>${Math.round(t[1] as number * 10000) / 100}%</b> ${t[0]}`)
	.join(", ");
const rows = (colos: getColo, sql: Colos) =>
	Object.entries(sql).map(a => [colos(a[0]), a[1]]).sort((a, b) => {
		try {
			return (a[0] as string).localeCompare(b[0] as string)
		} catch(e) {
			throw new Error(JSON.stringify(a));
		}
	}).reduce((a, b) =>
		`${a}<tr><td class="pv3 pr3 bb b--black-20">${b[0]}</td><td class="pv3 pr3 bb b--black-20">${buildData(colos, b[1] as Record<string, number>)}</td></tr>`
		, "");

export default rows;