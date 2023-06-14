type LastAuthor = {
	friendly_name: string;
};

export type Story = {
	name: string;
	updated_at: string;
	id: number;
	is_folder: boolean;
	slug: string;
	last_author: LastAuthor;
};

export type DatesourceEntry = { name: string; value: string; };

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


export const isStories = (data: unknown): data is Story[] => Array.isArray(data);
