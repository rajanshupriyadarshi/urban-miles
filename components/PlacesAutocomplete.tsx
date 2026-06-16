'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: string
  id: string
}

declare global {
  interface Window {
    google: typeof google
    initGoogleMaps?: () => void
  }
}

export default function PlacesAutocomplete({ value, onChange, placeholder, id }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [ready, setReady] = useState(false)

  // Load Google Maps script once
  useEffect(() => {
    if (typeof window === 'undefined') return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    // Already loaded
    if (window.google?.maps?.places) {
      setReady(true)
      return
    }

    // Script already injected
    if (document.getElementById('google-maps-script')) return

    window.initGoogleMaps = () => setReady(true)

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Attach autocomplete once Maps is ready
  useEffect(() => {
    if (!ready || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' }, // Restrict to India
      fields: ['formatted_address', 'name', 'geometry'],
      types: ['geocode', 'establishment'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      const selected = place?.name
        ? `${place.name}${place.formatted_address ? ', ' + place.formatted_address : ''}`
        : place?.formatted_address || ''
      onChange(selected)
    })

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [ready, onChange])

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoComplete="off"
      className="w-full text-slate-900 text-base font-medium placeholder-slate-400 outline-none bg-transparent"
    />
  )
}
