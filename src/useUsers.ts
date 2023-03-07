import { useState, useEffect } from 'react'
import { User, Error } from './types'

export const useUsers = (url: string) => {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>({ message: '' })

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const json = (await response.json()) as User[]
        if (active) {
          setData(json)
        }
      } catch (e) {
        setError({ message: 'An error happened' })
      } finally {
        active && setLoading(false)
      }
    }
    fetchData()

    return () => {
      active = false
    }
  }, [])

  return { data, setData, loading, error }
}
