interface Environment {
	KV: KVNamespace,
	DO: DurableObjectNamespace,
	NewDOLatency: AnalyticsEngineDataset,
	API_TOKEN: string,
}