import { isAppSessionQuery, sessionCookieStore } from "@storyblok/app-extension-auth";
import { H3Event } from "h3";
import { authHandlerParams } from "~/src/auth";
import { fetchDatasourceEntries } from "~/src/server/fetchDatasourceEntries";
import { Config } from "~/src/types";

export default defineEventHandler<Config>(async (event) => {
	const query = getQuery(event);
	if (!isAppSessionQuery(query)) {
		throw createError({
			statusCode: 401,
			statusMessage: "spaceId and userId query parameters are required",
		});
	}

	const sessionStore = sessionCookieStore(authHandlerParams())(requestParams(event));
	const appSession = await sessionStore.get(query);
	if (!appSession) {
		throw createError({
			statusCode: 401,
			statusMessage: "auth cookie not present",
		});
	}
	const { accessToken, region, spaceId } = appSession;
	const entries = await fetchDatasourceEntries(accessToken, region, spaceId);

	if (entries instanceof Error) {
		throw createError({
			statusCode: 500,
			statusMessage: "failed to fetch stories",
		});
	}

	const config = {
		accessToken: entries.find((de) => de.name === "AccessToken")?.value,
		buildId: entries.find((de) => de.name === "BuildId")?.value,
		projectName: entries.find((de) => de.name === "ProjectName")?.value,
	};
	return config;
});

const requestParams = (event: H3Event) => ({
	req: event.node.req,
	res: event.node.res,
});
