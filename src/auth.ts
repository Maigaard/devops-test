import { AuthHandlerParams } from "@storyblok/app-extension-auth";
import { endpointPrefix } from "~/src/endpointPrefix";

const isString = (variable: unknown): variable is string => typeof variable === "string" && variable.length > 0;

const getClientId = (clientId: string): string => {
	if (!isString(clientId)) {
		throw new Error("CLIENT_ID has not been specified");
	}

	return clientId;
};

const getClientSecret = (secret: string): string => {
	if (!isString(secret)) {
		throw new Error("CLIENT_SECRET has not been specified");
	}

	return secret;
};

const getBaseUrl = (url: string): string => {
	if (!isString(url)) {
		throw new Error("BASE_URL has not been specified");
	}

	return url;
};

export const authHandlerParams = () : AuthHandlerParams => {
	const { CLIENT_ID, CLIENT_SECRET, BASE_URL } = useRuntimeConfig();
	return {
		clientId: getClientId(CLIENT_ID),
		clientSecret: getClientSecret(CLIENT_SECRET),
		baseUrl: getBaseUrl(BASE_URL),
		successCallback: "/",
		errorCallback: "/401",
		endpointPrefix,
	};
};
