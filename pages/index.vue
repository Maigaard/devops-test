<template>
  <div>
    <div v-if="config" class="px-6 mb-6">
      <form @submit.prevent="startBuild">
        <fieldset>
          <label for="branch">Build miljø: </label>
          <select v-model="branch" id="branch">
            <option value="develop">Test</option>
            <option value="master">Production</option>
          </select>
          <button type="submit" style="border:1px black solid;">
            Start build
          </button>
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
    <div v-if="loadingContext || currentBuild">
      <img src="/spinner.gif" style="height:50px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  components: {},
  data: () => ({
    story: null,
    loadingContext: true,
    spaceId: null,
    branch: "develop",
    lastBuild: null,
    currentBuild: null,
    config: null
  }),
  computed: {
    endpoint() {
      if (this.config) {
        return `https://dev.azure.com/laitaps/${this.config.projectName}/_apis/build/builds/?api-version=7.0`;
      }
      return "";
    },
    headers() {
      if (this.config) {
        return {
          Authorization: `Basic ${this.config.accessToken}`,
          "Content-Type": "application/json"
        };
      }
      return {};
    },
    requestBody() {
      return {
        definition: {
          id: this.config.buildId
        },
        sourceBranch: `refs/heads/${this.branch}`,
        templateParameters: {}
      };
    }
  },
  mounted() {
    if (window.top === window.self) {
      window.location.assign("https://app.storyblok.com/oauth/tool_redirect");
    }

    // Use heightChange to change the height of the tool
    window.parent.postMessage(
      {
        action: "tool-changed",
        tool: "lait@azure-devops-tool",
        event: "heightChange",
        height: 400
      },
      "https://app.storyblok.com"
    );

    this.loadSpaceIdFromUrl();
    this.$nextTick(this.getDatasource);
  },
  methods: {
    loadSpaceIdFromUrl() {
      this.spaceId = this.$route.query.space_id || null;
    },
    async checkQueue() {
      const response = await fetch(
        this.endpoint + "&$top=5&queryOrder=queueTimedescending",
        {
          headers: this.headers
        }
      );

      const { value } = await response.json();
      this.currentBuild = value.find(
        build => build.status === "inProgress" || build.status === "notStarted"
      );
      this.lastBuild = value.find(build => build.status === "completed");
      this.checkStatusForBuild();
    },
    checkStatusForBuild() {
      if (this.currentBuild) {
        const interval = setInterval(async () => {
          const response = await fetch(this.currentBuild._links.self.href, {
            headers: this.headers
          });
          this.currentBuild = await response.json();

          if (
            this.currentBuild.status === "completed" ||
            this.currentBuild.status === "cancelling"
          ) {
            this.lastBuild = JSON.parse(JSON.stringify(this.currentBuild));
            this.currentBuild = null;
            clearInterval(interval);
          }
        }, 5000);
      }
    },
    async startBuild() {
      this.loadingContext = true;
      await this.checkQueue();
      if (this.currentBuild == null) {
        try {
          const response = await fetch(this.endpoint, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify(this.requestBody)
          });

          this.currentBuild = await response.json();
          this.checkStatusForBuild();
        } catch (error) {
          await this.checkQueue();
        }
      }
      this.loadingContext = false;
    },
    async getDatasource() {
      const url = `/auth/spaces/${this.spaceId}/datasource_entries?datasource_slug=devops`;

      const response = await fetch(url);
      const data = await response.json();

      this.config = {
        accessToken: data.datasource_entries.find(
          de => de.name === "AccessToken"
        )?.value,
        buildId: data.datasource_entries.find(de => de.name === "BuildId")
          ?.value,
        projectName: data.datasource_entries.find(
          de => de.name === "ProjectName"
        )?.value
      };
      this.checkQueue();
      this.loadingContext = false;
    }
  }
};
</script>

<style></style>
