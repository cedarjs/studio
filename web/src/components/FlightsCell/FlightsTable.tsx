import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import type { FlightsPreviewQuery } from 'types/graphql'

import { Link, routes } from '@cedarjs/router'

import type { RscChunkMessage } from 'src/components/RscParser/types'

interface RscChunkMessageDataExtended {
  id: string
  title: string
  fetchUrl: string
  fetchHeaders: Record<string, string | undefined>
  fetchStartTime: number
  chunkValue: number[]
  chunkStartTime: number
  chunkEndTime: number
  chunkDuration: number
  sizeInBytes: number
}

interface RscChunkMessageExtended extends RscChunkMessage {
  data: RscChunkMessageDataExtended
}

export const FlightsTable = ({ flightsPreview }: FlightsPreviewQuery) => {
  const messages = flightsPreview.flights.map((flight) => {
    const { id, preview, payload, metadata, performance } = flight

    // Assume it's a server action if `preview` contains a `#`
    const rsaTitle = preview.includes('#') ? preview.split('/').at(-1) : ''

    // metadata.request.url will be something like this for RSCs:
    // /__rwjs__Routes?__rwjs__pathname=/blog/hello-world&__rwjs__search=?foo=bar&baz=qux
    const fetchUrl = metadata?.request?.url || ''
    const splitUrl = fetchUrl.split('?').slice(1).join('?').split('&')
    const urlLocation = splitUrl[0].replace('__rwjs__pathname=', '')
    const urlSearch = splitUrl
      .slice(1)
      .join('&')
      .replace(/^__rwjs__search=/, '')
    const rscTitle = urlLocation + urlSearch

    return {
      type: 'RSC_CHUNK',
      tabId: 0,
      data: {
        id,
        title: rsaTitle || rscTitle,
        fetchUrl: metadata?.request?.url || '',
        fetchHeaders: metadata?.request?.headers || {},
        fetchStartTime: 0,
        chunkStartTime: parseISO(performance.startedAt).getTime(),
        chunkEndTime: parseISO(performance.endedAt).getTime(),
        chunkDuration: performance.duration,
        chunkValue: Array.from(new TextEncoder().encode(payload)),
        sizeInBytes: performance.sizeInBytes / 1_024.0,
      },
    } satisfies RscChunkMessageExtended
  })

  return (
    <Card className="mx-auto mt-4 w-full">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Preview</TableHeaderCell>
            <TableHeaderCell className="text-right">When</TableHeaderCell>
            <TableHeaderCell className="text-right">
              Duration (ms)
            </TableHeaderCell>
            <TableHeaderCell className="text-right">Size (kb)</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {messages
            .slice()
            .reverse()
            .map((message, idx) => {
              const data = message?.data

              if (data === undefined) {
                return
              }

              return (
                <TableRow key={idx}>
                  <TableCell>
                    <Link
                      to={routes.flight({ id: data.id })}
                      className="font-semibold text-tremor-content hover:text-tremor-brand dark:text-dark-tremor-content-emphasis dark:hover:text-dark-tremor-brand"
                    >
                      {data.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDistanceToNow(data.chunkStartTime, {
                      includeSeconds: true,
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.chunkDuration.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.sizeInBytes.toFixed(3)}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </Card>
  )
}
