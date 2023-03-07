import { useEffect, useState } from 'react'
import './App.css'
import { useUsers } from './useUsers'
import { Search } from './components/Search'
import { Table } from './components/Table'
import { User } from './types'

const App = () => {
  const { data, setData, loading, error } = useUsers(
    'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [deletedUserIds, setDeletedUserIds] = useState<string[]>([])

  useEffect(() => {
    setUsers(data)
  }, [data])

  useEffect(() => {
    const filteredUsers = users.filter(
      (user) => !deletedUserIds.includes(user.id)
    )
    setData(filteredUsers)
  }, [deletedUserIds])

  const handleSearch = (term: string) => {
    if (term === '' && data) {
      setUsers(data)
      return setCurrentPage(1)
    }
    const filteredUsers = users?.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.includes(term.toLowerCase()) ||
        user.role.includes(term.toLowerCase())
    )
    setUsers(filteredUsers)
    return setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowSelection = (userId: string) => {
    setSelectedUserIds((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId)
      } else {
        return prevSelected && [...prevSelected, userId]
      }
    })
  }

  const handleSelectAll = (ids: string[]) => {
    setSelectedUserIds(ids)
  }

  const updateData = (
    id: string,
    name: string,
    email: string,
    role: User['role']
  ) => {
    setData((prevData) =>
      prevData.map((user) => {
        if (user.id === id) {
          return { id, name, email, role }
        }
        return user
      })
    )
  }

  const handleDelete = (userId: string) => {
    setDeletedUserIds([...deletedUserIds, userId])
  }

  const handleDeleteSelected = () => {
    setDeletedUserIds((previousIds) => [...previousIds, ...selectedUserIds])
    setSelectedUserIds([])
  }

  if (loading)
    return (
      <div className='loading'>
        <h1>Loading</h1>
      </div>
    )

  if (error?.message)
    return (
      <div className='error'>
        <h1>{error.message}</h1>
      </div>
    )

  return (
    <>
      <Search onSearch={handleSearch} />
      {users && (
        <Table
          users={users}
          currentPage={currentPage}
          selectedUserIds={selectedUserIds}
          onRowSelection={handleRowSelection}
          onSelectAll={handleSelectAll}
          updateData={updateData}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export default App
