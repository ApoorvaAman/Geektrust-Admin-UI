import { ChangeEvent, useState } from 'react'

type SearchProps = {
  onSearch: (term: string) => void
}

export const Search = ({ onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  return (
    <div className='search-center'>
      <input
        className='search'
        type='text'
        value={searchTerm}
        onChange={handleChange}
        placeholder='Search by name, email or role'
      />
    </div>
  )
}
