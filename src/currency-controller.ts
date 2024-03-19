import { cleaveUrlPathName } from './url';

const SYMBOLS_API = '/symbols';
const ROOT_API = '/';

export const currencyController = (url: URL, apikey: string) => {
	console.log('Currency Controller: URL', url.pathname);

	if (url.pathname.startsWith(SYMBOLS_API)) {
		return getSymbols(cleaveUrlPathName(url, SYMBOLS_API), apikey);
	}

	if (url.pathname === ROOT_API) {
		return new Response('Currency Controller!');
	}

	return new Response('Bad Request', {
		status: 400,
		statusText: 'Your request could not be understood by the server.',
	});
};

const getSymbols = async (url: URL, apikey: string): Promise<Response> => {
	const remoteUrl = 'https://api.apilayer.com/exchangerates_data/symbols';

	const options = {
		method: 'GET',
		headers: {
			apikey: apikey,
		},
	};

	try {
		const response = await fetch(remoteUrl, options);

		if (!response.ok) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const data = await response.json();
		return new Response(JSON.stringify(data));
	} catch (error) {
		return new Response('Bad Request', {
			status: 400,
		});
	}
};
