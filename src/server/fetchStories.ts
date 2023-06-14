import { Region } from '@storyblok/app-extension-auth'
import StoryblokClient from 'storyblok-js-client'
import { DatesourceEntry, isStories, Story } from '~/src/Story'

type DatasourceEntriesResponse = {
  datasource_entries: DatesourceEntry[]
}

const isStoriesResponse = (data: unknown): data is DatasourceEntriesResponse =>
  typeof data === 'object' &&
  data !== null &&
  'datasource_entries' in data &&
  isStories(data.datasource_entries)

export const fetchStories = (
  accessToken: string,
  region: Region,
  spaceId: number,
): Promise<DatesourceEntry[] | Error> =>
  new StoryblokClient({
    oauthToken: `Bearer ${accessToken}`,
    region,
  })
    .get(`spaces/${spaceId}/datasource_entries?datasource_id=192955`)
    .then((res) => res.data as unknown)
    .then((data) => (isStoriesResponse(data) ? data.datasource_entries : undefined))
    .catch((error) => error)
