'use client'

import { useState } from 'react'
import { useThemeContext } from '../context/GlobalContext'

export default function FeatureRequestForm() {
  const { styles } = useThemeContext()
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (value.trim().length === 0) {
      return
    }

    alert('Thank you for your feature request! We will review it soon.')
    setValue('')
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="mb-5 font-bold">Feature Request</h1>

      <div className="mb-5">Want Hiro to do more? Did you find a bug? Let us know!</div>

      <form onSubmit={handleSubmit} className="not-prose mb-8">
        <div
          className={`rounded-lg outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600 ${styles.background} ${styles.text}`}
        >
          <label htmlFor="feature-request" className="sr-only">
            Feature Request
          </label>
          <textarea
            id="feature-request"
            name="feature-request"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={6}
            placeholder="Describe your feature request..."
            className="block w-full resize-none bg-transparent px-3 py-2 text-base placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        </div>
        <button type="submit" className={`${styles.button} mt-4`} disabled={value.trim().length === 0}>
          Submit Feature Request
        </button>
      </form>
    </div>
  )
}
