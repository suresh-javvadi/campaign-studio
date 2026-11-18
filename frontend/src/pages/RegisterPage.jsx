import { useId, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { consumePendingTemplateId } from '../auth/pendingTemplate.js'
import { createProjectFromTemplate } from '../api/projects.js'

const MIN_PASSWORD_LENGTH = 8

function RegisterPage() {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    setIsSubmitting(true)
    try {
      await register({ name, email, password })

      const pendingTemplateId = consumePendingTemplateId()
      if (pendingTemplateId) {
        const project = await createProjectFromTemplate(pendingTemplateId)
        navigate(`/personalize/${project.id}`, { replace: true })
        return
      }

      navigate(searchParams.get('next') || '/app', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-sunken px-5">
      <div className="w-full max-w-sm bg-surface border border-ink/8 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] p-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <span className="w-7 h-7 rounded-sm bg-accent text-white flex items-center justify-center text-xs font-bold">
            CS
          </span>
          <span className="text-[15px] font-semibold text-ink">Campaign Studio</span>
        </Link>

        <h1 className="text-xl font-semibold text-ink tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Personalize political posters with your photo and details in minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={nameId} className="text-[13px] font-medium text-ink">
              Full name
            </label>
            <input
              id={nameId}
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={emailId} className="text-[13px] font-medium text-ink">
              Email
            </label>
            <input
              id={emailId}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={passwordId} className="text-[13px] font-medium text-ink">
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
            />
            <p className="m-0 text-xs text-ink-tertiary">At least {MIN_PASSWORD_LENGTH} characters.</p>
          </div>

          {error && <p className="m-0 text-xs text-danger">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-sm text-ink-secondary text-center">
          Already have an account?{' '}
          <Link
            to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
