import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

const EditableImage = ({
  src,
  alt,
  onSave,
  className,
  wrapperClassName,
  children,
}) => {
  const { isAuthenticated } = useAuth()
  const { editMode } = useData()
  const canEdit = isAuthenticated && editMode

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(src ?? '')
  const inputRef = useRef(null)

  useEffect(() => { setDraft(src ?? '') }, [src])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [open])

  const openModal = (e) => {
    if (!canEdit) return
    e.preventDefault()
    e.stopPropagation()
    setDraft(src ?? '')
    setOpen(true)
  }

  const closeModal = () => { setDraft(src ?? ''); setOpen(false) }

  const save = () => { onSave((draft ?? '').trim()); setOpen(false) }

  return (
    <>
      <div className={`${wrapperClassName || ''} group/img ${canEdit ? 'cursor-pointer' : ''}`} onClick={openModal}>
        {children || <img src={src} alt={alt} className={className} />}

        {canEdit && (
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors duration-200 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg">
              <Pencil className="w-3 h-3" />
              Zmień zdjęcie
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.12 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Zmień zdjęcie</span>
                <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={inputRef}
                type="url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') closeModal()
                  if (e.key === 'Enter') { e.preventDefault(); save() }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />

              {draft && (
                <img
                  src={draft}
                  alt="Podgląd"
                  className="w-full h-48 object-cover rounded-lg border mt-3"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={closeModal} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  Anuluj
                </button>
                <button onClick={save} className="flex-1 px-3 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center gap-1.5">
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

export default EditableImage
