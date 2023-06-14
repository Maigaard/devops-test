export const fetchDevopsInfo = async (spaceId: string, baseUrl: string) => {
	const url = `${"https://app.storyblok.com"}/auth/spaces/${spaceId}/datasource_entries?datasource_slug=devops`;
	console.log("1",url);

	const response = await fetch(url);
	console.log(response);
	console.log("2",url);

	const data = response as {
		datasource_entries: { name: string; value: string }[];
	};
	console.log("3",url);


	return {
		accessToken: data.datasource_entries.find((de) => de.name === "AccessToken")?.value,
		buildId: data.datasource_entries.find((de) => de.name === "BuildId")?.value,
		projectName: data.datasource_entries.find((de) => de.name === "ProjectName")?.value,
	};
};
