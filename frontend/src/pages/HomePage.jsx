import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PosterCard from '../components/PosterCard.jsx'
import Button from '../components/Button.jsx'
import { listTemplates, getTemplateFilters } from '../api/templates.js'

const FEATURED_LIMIT = 8

function HomePage() {
  const [templates, setTemplates] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    Promise.all([listTemplates(), getTemplateFilters()])
      .then(([templateData, filterData]) => {
        if (cancelled) return
        setTemplates(templateData)
        setCategories(filterData.categories)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col">
      <section className="border-b border-ink/8 bg-[linear-gradient(180deg,var(--color-surface-sunken),var(--color-surface))]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24 flex flex-col items-center text-center gap-5">
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            Made for political leaders in India
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold text-ink tracking-tight max-w-3xl">
            Personalize political posters in minutes, not days
          </h1>
          <p className="text-base md:text-lg text-ink-secondary max-w-xl">
            Pick a ready-made poster, add your photo and your own name, title, and slogan in
            Telugu or English, and download a print-ready design.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Button as={Link} to="/gallery" className="px-6">
              Browse Posters
            </Button>
            <Button as={Link} to="/register" variant="outline" className="px-6">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex items-center gap-2.5 flex-wrap justify-center">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/gallery?category=${encodeURIComponent(category)}`}
              className="px-3.5 py-1.5 rounded-full border border-ink/8 text-sm font-medium text-ink-secondary hover:border-accent/40 hover:text-accent transition-colors duration-150"
            >
              {category}
            </Link>
          ))}
        </section>
      )}

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-ink tracking-tight">
            Popular Posters
          </h2>
          <Link to="/gallery" className="text-sm font-semibold text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>

        {status === 'loading' && <p className="m-0 text-sm text-ink-tertiary">Loading posters…</p>}
        {status === 'error' && (
          <p className="m-0 text-sm text-danger">
            Couldn&apos;t load posters. Is the backend running?
          </p>
        )}
        {status === 'ready' && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {templates.slice(0, FEATURED_LIMIT).map((template) => (
              <PosterCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-ink/8 bg-surface-sunken">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-14 flex flex-col items-center text-center gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-ink tracking-tight">
            Ready to create your poster?
          </h2>
          <p className="text-sm md:text-base text-ink-secondary max-w-md">
            It takes less than five minutes — pick a poster, log in, and personalize it.
          </p>
          <Button as={Link} to="/gallery" className="px-6">
            Browse Posters
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
