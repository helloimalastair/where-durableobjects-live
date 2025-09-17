import type { LiveKV } from "@wdol/types";
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
			// caches?: CacheStorage & { default: Cache };
			cf?: IncomingRequestCfProperties;
			env: Env
		}
	}
}
