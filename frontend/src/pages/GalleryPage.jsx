import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PosterCard from '../components/PosterCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { IconFrame, IconSearch } from '../components/icons.jsx'
import { listTemplates, getTemplateFilters } from '../api/templates.js'

const ALL = 'All'

function GalleryPage() {
  const [searchParams] = useSearchParams()
  const [templates, setTemplates] = useState([])
  const [filters, setFilters] = useState({ categories: [], partyTags: [] })
  const [status, setStatus] = useState('loading')
  const [category, setCategory] = useState(searchParams.get('category') || ALL)
  const [partyTag, setPartyTag] = useState(ALL)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getTemplateFilters()
      .then(setFilters)
      .catch(() => {
        // filter chips are a nice-to-have; the gallery still works without them
      })
  }, [])

  useEffect(() => {
    let cancelled = false

    listTemplates({
      category: category === ALL ? undefined : category,
      partyTag: partyTag === ALL ? undefined : partyTag,
      q: search || undefined,
    })
      .then((data) => {
        if (!cancelled) {
          setTemplates(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [category, partyTag, search])

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-[28px] font-semibold text-ink tracking-tight">
          Poster Gallery
        </h1>
        <p className="mt-1.5 text-sm text-ink-secondary">
          Browse every poster template. Pick one to personalize with your own photo and details.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary w-4 h-4" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posters…"
            className="w-full h-10 pl-9 pr-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink placeholder:text-ink-tertiary outline-none focus:border-ink/14"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
        >
          <option value={ALL}>All categories</option>
          {filters.categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={partyTag}
          onChange={(event) => setPartyTag(event.target.value)}
          className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
        >
          <option value={ALL}>All parties</option>
          {filters.partyTags.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {status === 'loading' && <p className="m-0 text-sm text-ink-tertiary">Loading posters…</p>}
      {status === 'error' && (
        <p className="m-0 text-sm text-danger">
          Couldn&apos;t load posters. Is the backend running?
        </p>
      )}
      {status === 'ready' && templates.length === 0 && (
        <EmptyState
          icon={IconFrame}
          title="No posters found"
          subtitle="Try a different search term or filter."
        />
      )}
      {status === 'ready' && templates.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {templates.map((template) => (
            <PosterCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryPage
