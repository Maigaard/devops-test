<script setup lang="ts">
import { navigateTo, useFetch, useRoute } from "#app";
import { initOauthFlowUrl } from "~/src/endpointPrefix";
import { Build } from "~/src/types";

const route = useRoute();
const { spaceId, userId } = route.query;
if (!spaceId || !userId) {
	navigateTo(initOauthFlowUrl);
}

let currentBuild: Ref<Build | undefined> = ref(undefined),
	lastBuild: Ref<Build | undefined> = ref(undefined),
	loadingContext = ref(true);
const branch = ref("develop");

if (!process.server) {
	window.parent.postMessage(
		{
			action: "tool-changed",
			tool: "lait@azure-devops-tool",
			event: "heightChange",
			height: 250,
		},
		"https://app.storyblok.com"
	);
}

const { data } = await useFetch(() => `/api/devOpsSettings`, {
	params: {
		spaceId,
		userId,
	},
});
if (!data || !data.value) {
	throw createError({
		statusCode: 500,
		statusMessage: "failed to fetch config",
	});
}

const endpoint = ref(`https://dev.azure.com/laitaps/${data.value.projectName}/_apis/build/builds/?api-version=7.0`);
const headers = ref({
	Authorization: `Basic ${data.value.accessToken}`,
	"Content-Type": "application/json",
});

const checkQueue = async () => {
	const response = await fetch(endpoint.value + "&$top=5&queryOrder=queueTimedescending", {
		headers: headers.value,
	});

	const { value } = (await response.json()) as { value: Build[] };
	currentBuild.value = value.find((build) => build.status === "inProgress" || build.status === "notStarted");
	lastBuild.value = value.find((build) => build.status === "completed");
	checkStatusForBuild();
};
checkQueue();

const checkStatusForBuild = () => {
	if (currentBuild.value) {
		const interval = setInterval(async () => {
			const response = await fetch(currentBuild.value!._links.self.href, {
				headers: headers.value,
			});
			currentBuild.value = await response.json();

			if (currentBuild.value?.status === "completed" || currentBuild.value?.status === "cancelling") {
				lastBuild = JSON.parse(JSON.stringify(currentBuild));
				currentBuild.value = undefined;
				clearInterval(interval);
			}
		}, 5000);
	}
};

const startBuild = async () => {
	loadingContext.value = true;
	await checkQueue();
	if (currentBuild.value == null) {
		try {
			const response = await fetch(endpoint.value, {
				headers: headers.value,
				method: "POST",
				body: JSON.stringify({
					definition: {
						id: data.value!.buildId,
					},
					sourceBranch: `refs/heads/${branch.value}`,
					templateParameters: {},
				}),
			});

			currentBuild.value = await response.json();
			checkStatusForBuild();
		} catch (error) {
			await checkQueue();
		}
	}
	loadingContext.value = false;
};
</script>

<template>
	<div>
		<div v-if="data" class="mb-6 px-6">
			<form @submit.prevent="startBuild">
				<fieldset>
					<label for="branch">Build miljø: </label>
					<select v-model="branch" id="branch" v-if="data.value.environment === 'dev'">
						<option value="develop">Test</option>
					</select>
					<select v-model="branch" id="branch" v-else-if="data.value.environment === 'prod'">
						<option value="master">Production</option>
					</select>
					<button type="submit" style="border: 1px black solid">Start build</button>
				</fieldset>
			</form>
		</div>

		<div v-if="lastBuild">
			<p>Last build status : {{ lastBuild.status }}</p>
			<p>Last build time: {{ lastBuild.finishTime }}</p>
		</div>
		<div v-if="currentBuild">
			<p>Et build er i gang. Start tid: {{ currentBuild.startTime }}</p>
			<p>
				Status:
				{{
					currentBuild.status === "notStarted"
						? "I kø, forventer at det starter inden så længe"
						: "Buildet er i gang."
				}}
			</p>
		</div>
		<!-- <div v-if="loadingContext || currentBuild">
      <img src="/public/spinner.gif" style="height:50px" />
    </div> -->
	</div>
</template>

<style scoped>
.app {
	flex: 1;
}

.app__text {
	color: #8d919f;
}

.app__story-table {
	margin-top: 22px;
}
</style>
