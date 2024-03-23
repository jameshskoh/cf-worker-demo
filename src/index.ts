/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { cleaveUrlPathName } from './url';
import { currencyController } from './currency-controller';
import { homeController } from './home-controller';

export interface Env {
	VERSION: string;
	CURRENCY_API_KEY: string;

	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	WORKER_KV: KVNamespace;

	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const EXCHANGE_RATE_API = '/exchange-rate';

const KV_KEY_BACKEND = 'endpoints';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// #TODO error boundary + Error types + Error throwing
		const url = new URL(request.url);

		if (url.pathname.startsWith(EXCHANGE_RATE_API)) {
			return currencyController(cleaveUrlPathName(url, EXCHANGE_RATE_API), env.CURRENCY_API_KEY);
		}

		const backendUrl = 'https://' + (await env.WORKER_KV.get(KV_KEY_BACKEND));

		if (!backendUrl) {
			return new Response('Server error', {
				status: 500,
			});
		}

		return homeController(backendUrl);
	},
};
