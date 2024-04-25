interface CoverageSQLResponse {
	data: [
		{
			coverage: number;
		},
	];
}

interface HourlySQLResponse {
	data: [
		{
			hourly: number;
		},
	];
}

export type { CoverageSQLResponse, HourlySQLResponse };
