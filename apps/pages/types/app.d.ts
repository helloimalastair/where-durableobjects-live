import type { LiveKV } from "@wdol/types";
import type { Axiom } from "@axiomhq/js";
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getLive(): Promise<LiveKV>;
		}
		// interface PageData {}
		interface Platform {
			context?: ExecutionContext;
			caches?: CacheStorage & { default: Cache };
			cf?: IncomingRequestCfProperties;
			env: {
				KV: KVNamespace;
				AE?: AnalyticsEngineDataset;
				DO: DurableObjectNamespace;
				AXIOM_TOKEN: string;
				AXIOM_ORG_ID: string;
				AXIOM_DATASET: string;
				AXIOM: Axiom
			};
		}
	}
}
