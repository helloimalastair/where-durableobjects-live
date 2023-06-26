const coverage = (s: ColoJSONV2) => {
	const doColos = new Set();
	Object.values(s).forEach(e => Object.keys(e).forEach(f => doColos.add(f)));
	return Math.round((doColos.size / Object.keys(s).length) * 10000) / 10000;
};
export default coverage;