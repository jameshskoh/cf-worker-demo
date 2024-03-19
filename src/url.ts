export const cleaveUrlPathName = (url: URL, endpoint: string): URL => {
	const newUrl = new URL(url);
	newUrl.pathname = newUrl.pathname.substring(endpoint.length);
	return newUrl;
}
