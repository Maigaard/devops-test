export type DatesourceEntry = { name: string; value: string };

export type Build = {
	status: string;
	_links: {
		self: { href: string };
	};
	result: string;
	id: number;
	queueTime: string;
	startTime: string;
	finishTime: string;
};

export type Config = {
	accessToken: string | undefined;
	buildId: string | undefined;
	projectName: string | undefined;
	environemt: string | undefined;
};

export const isDatasourceEntries = (data: unknown): data is DatesourceEntry[] => Array.isArray(data);
