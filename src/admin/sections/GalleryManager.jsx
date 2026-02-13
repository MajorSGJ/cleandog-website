import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  GripVertical, 
  X, 
  Check,
  Image as ImageIcon,
  Tag,
  Link as LinkIcon
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const GalleryManager = ({ onSuccess }) => {
  const { data, addGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGallery } = useData()
  const [editingId, setEditingId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newImage, setNewImage] = useState({ src: '', alt: '', category: 'Metamorfozy' })

  const categories = ['Metamorfozy', 'Strzyżenie', 'Pielęgnacja', 'Nasi klienci']

  const handleAdd = () => {
    if (newImage.src && newImage.alt) {
      addGalleryImage(newImage)
      setNewImage({ src: '', alt: '', category: 'Metamorfozy' })
      setShowAddModal(false)
      onSuccess('Zdjęcie zostało dodane!')
    }
  }

  const handleDelete = (id) => {
    if (confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
      deleteGalleryImage(id)
      onSuccess('Zdjęcie zostało usunięte')
    }
  }

  const handleReorder = (newOrder) => {
    // Update the full gallery order based on the new arrangement
    newOrder.forEach((item, toIndex) => {
      const fromIndex = data.gallery.findIndex(img => img.id === item.id)
      if (fromIndex !== toIndex) {
        reorderGallery(fromIndex, toIndex)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Zarządzanie Galerią</h3>
          <p className="text-sm text-gray-500">Dodawaj, edytuj i zmieniaj kolejność zdjęć w galerii</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Dodaj zdjęcie
        </motion.button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.gallery.map((image, index) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Drag Handle */}
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Błąd+ładowania'
                }}
              />
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block px-2 py-1 bg-primary-500/80 text-white text-xs rounded-full mb-2">
                  {image.category}
                </span>
                <p className="text-white text-sm font-medium line-clamp-2">{image.alt}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(image.id)}
                className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
              >
                <Edit3 className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="p-2 bg-white/90 hover:bg-red-50 rounded-lg shadow-md transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Dodaj nowe zdjęcie</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    URL zdjęcia
                  </label>
                  <input
                    type="url"
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                    placeholder="https://example.com/zdjecie.jpg"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Opis zdjęcia
                  </label>
                  <input
                    type="text"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                    placeholder="np. Metamorfoza po strzyżeniu"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Kategoria
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {newImage.src && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Podgląd:</p>
                    <img
                      src={newImage.src}
                      alt="Podgląd"
                      className="w-full h-48 object-cover rounded-xl border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Błąd+URL'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newImage.src || !newImage.alt}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-5 h-5 inline mr-2" />
                  Dodaj
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <EditImageModal
            image={data.gallery.find(img => img.id === editingId)}
            categories={categories}
            onSave={(updates) => {
              updateGalleryImage(editingId, updates)
              setEditingId(null)
              onSuccess('Zdjęcie zostało zaktualizowane')
            }}
            onClose={() => setEditingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const EditImageModal = ({ image, categories, onSave, onClose }) => {
  if (!image) return null

  return <EditImageModalInner image={image} categories={categories} onSave={onSave} onClose={onClose} />
}

const EditImageModalInner = ({ image, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    src: image.src || '',
    alt: image.alt || '',
    category: image.category || 'Metamorfozy'
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Edytuj zdjęcie</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL zdjęcia</label>
            <input
              type="url"
              value={formData.src}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {formData.src && (
            <img
              src={formData.src}
              alt="Podgląd"
              className="w-full h-48 object-cover rounded-xl border"
            />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium"
          >
            Zapisz zmiany
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GalleryManager
