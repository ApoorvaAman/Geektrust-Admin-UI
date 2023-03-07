import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { User } from '../types'
import { Pagination } from './Pagination'

type TableProps = {
  users: User[]
  currentPage: number
  selectedUserIds: string[]
  onRowSelection: (userId: string) => void
  onSelectAll: (ids: string[]) => void
  updateData: (
    id: string,
    name: string,
    email: string,
    role: User['role']
  ) => void
  onDelete: (userId: string) => void
  onDeleteSelected: () => void
  onPageChange: (page: number) => void
}

interface UserFormData extends Partial<User> {
  name?: string
  email?: string
  role?: User['role']
}
export const Table = ({
  users,
  currentPage,
  selectedUserIds,
  onRowSelection,
  onSelectAll,
  updateData,
  onDelete,
  onDeleteSelected,
  onPageChange,
}: TableProps) => {
  const usersPerPage = 10
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentPageUsers = users.slice(startIndex, endIndex)

  const dialogRef = useRef<HTMLDialogElement>(null)

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<User['role']>('member')
  const [editUserId, setEditUserId] = useState<string>('')

  const openModal = (userId: string) => {
    dialogRef.current?.showModal()
    setEditUserId(userId)
    const user = users.find((user) => user.id === userId)
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
    }
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson: UserFormData = Object.fromEntries(formData.entries())
    const user = users.find((user) => user.id === editUserId)
    if (user) {
      const name = formJson.name ?? user.name
      const email = formJson.email ?? user.email
      const role = formJson.role ?? user.role

      console.log(editUserId, name, email, role)
      updateData(editUserId, name, email, role)
      dialogRef.current?.close()
    }
  }

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked)
      onSelectAll(currentPageUsers.map((user) => user.id))
    else onSelectAll([])
  }

  return (
    <>
      <dialog ref={dialogRef}>
        <form method='dialog' onSubmit={(e) => handleEdit(e)}>
          <div className='grid'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='grid'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div>
              <input
                type='radio'
                name='role'
                id='member'
                value='member'
                checked={role === 'member'}
                onChange={(e) => setRole(e.target.value as User['role'])}
              />
              <label htmlFor='member'>Member</label>
            </div>
            <div>
              <input
                type='radio'
                name='role'
                id='admin'
                value='admin'
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value as User['role'])}
              />
              <label htmlFor='admin'>Admin</label>
            </div>
          </div>
          <button type='submit'>Update</button>
          <button type='button' onClick={closeModal}>
            Cancel
          </button>
        </form>
      </dialog>
      <div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={
                    selectedUserIds.length ===
                    currentPageUsers.map((user) => user.id).length
                  }
                  onChange={(e) => handleSelectAll(e)}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageUsers.length === 0 && (
              <tr className='empty-row'>
                <td colSpan={5}>No Entries Found</td>
              </tr>
            )}
            {currentPageUsers.map((user) => (
              <tr
                key={user.id}
                className={
                  selectedUserIds.includes(user.id) ? 'selected' : undefined
                }
              >
                <td>
                  <input
                    type='checkbox'
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => onRowSelection(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role[0].toUpperCase() + user.role.slice(1)}</td>
                <td>
                  <button
                    className='action-button'
                    onClick={() => openModal(user.id)}
                  >
                    <img className='svg editBtn' src='/edit.svg' alt='Edit' />
                  </button>
                  <button
                    className='action-button'
                    onClick={() => onDelete(user.id)}
                  >
                    <img className='svg delBtn' src='/trash.svg' alt='Delete' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination-align'>
          <button
            className='delete-all'
            onClick={() => {
              onDeleteSelected()
              if (currentPageUsers.length === 0) onPageChange(1)
            }}
          >
            Delete selected
          </button>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(users.length / usersPerPage)}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  )
}
