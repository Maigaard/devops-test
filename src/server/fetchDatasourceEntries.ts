import { Region } from '@storyblok/app-extension-auth'
import StoryblokClient from 'storyblok-js-client'
import { DatesourceEntry, isDatasourceEntries as isDatasourceEntries } from '~/src/types'

type DatasourceEntriesResponse = {
  datasource_entries: DatesourceEntry[]
}

const isDatasourceEntriesResponse = (data: unknown): data is DatasourceEntriesResponse =>
  typeof data === 'object' &&
  data !== null &&
  'datasource_entries' in data &&
  isDatasourceEntries(data.datasource_entries)

export const fetchDatasourceEntries = (
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
    .then((data) => (isDatasourceEntriesResponse(data) ? data.datasource_entries : undefined))
    .catch((error) => error)
