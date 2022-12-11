const coloFetch = async () => {
	const colos = (await (await fetch("https://speed.cloudflare.com/locations")).json<LocationResponse[]>()).reduce((a, b) => {
		a[b.iata] = `${b.city} (${b.iata})`;
		return a;
	}, {} as Record<string, string>);
	return (iata: string) => {
		let name = colos[iata];
		if(!name) {
			if(iata === "SFO-DOG") {
				name = "SFPuppers (SFO-DOG)";
			} else {
				name = `Unknown (${iata})`;
			}
		}
		return name;
	}
};

export default coloFetch;