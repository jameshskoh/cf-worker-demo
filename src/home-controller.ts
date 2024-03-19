export const homeController = (remoteUrl: string): Promise<Response> => {
	return getHelloWorld(remoteUrl);
};

const getHelloWorld = async (remoteUrl: string): Promise<Response> => {
	const options = {
		method: 'GET',
	};

	try {
		const response = await fetch(remoteUrl, options);

		if (!response.ok) {
			return new Response('Server error', {
				status: 400,
			});
		}

		const data = await response.text();

		return new Response(data + ' remotely!');
	} catch (error) {
		return new Response('Bad Request', {
			status: 400,
		});
	}
};
