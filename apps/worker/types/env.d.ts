// Generated by Wrangler by running `wrangler types types/env.d.ts -j --x-include-runtime=types/workerd.d.ts`

interface Env {
	KV: KVNamespace;
	API_TOKEN: string;
	DO: DurableObjectNamespace<import("../src/index").DO>;
	WDL: AnalyticsEngineDataset;
}
