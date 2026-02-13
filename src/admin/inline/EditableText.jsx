import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

const EditableText = ({
  value,
  onSave,
  className,
  as: Tag = 'span',
  multiline = false,
  placeholder = '',
}) => {
  const { isAuthenticated } = useAuth()
  const { editMode } = useData()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const inputRef = useRef(null)

  useEffect(() => { setDraft(value ?? '') }, [value])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [open])

  const canEdit = isAuthenticated && editMode

  const handleOpen = (e) => {
    if (!canEdit) return
    e.preventDefault()
    e.stopPropagation()
    setDraft(value ?? '')
    setOpen(true)
  }

  const handleClose = () => { setDraft(value ?? ''); setOpen(false) }

  const handleSave = () => { onSave((draft ?? '').trim()); setOpen(false) }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClose()
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); handleSave() }
  }

  if (!canEdit) return <Tag className={className}>{value}</Tag>

  return (
    <>
      <Tag
        className={`${className || ''} group/edit cursor-pointer`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(e) }}
      >
        {value}
        <span
          className="inline-flex items-center justify-center w-4 h-4 ml-1 align-middle rounded bg-primary-500 text-white opacity-0 group-hover/edit:opacity-100 transition-opacity"
          style={{ fontSize: 0 }}
        >
          <Pencil className="w-2.5 h-2.5" />
        </span>
      </Tag>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.12 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Edytuj tekst</span>
                <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {multiline ? (
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={4}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={handleClose} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  Anuluj
                </button>
                <button onClick={handleSave} className="flex-1 px-3 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Zapisz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EditableText
