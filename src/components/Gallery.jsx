import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableImage from '../admin/inline/EditableImage'
import EditableKeyText from '../admin/inline/EditableKeyText'

const Gallery = () => {
  const { data, updateGalleryImage, editMode } = useData()
  const images = data.gallery
  const [selectedImage, setSelectedImage] = useState(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const openLightbox = (index) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-primary-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider mb-4">
            <Camera className="w-4 h-4" />
            <EditableKeyText textKey="gallery.badge" fallback="Galeria" as="span" />
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <EditableKeyText textKey="gallery.title.line1" fallback="Zobacz nasze" as="span" />
            <br />
            <span className="gradient-text">
              <EditableKeyText textKey="gallery.title.line2" fallback="metamorfozy" as="span" />
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            <EditableKeyText
              textKey="gallery.description"
              fallback="Zapraszamy do obejrzenia galerii naszych czworonożnych klientów. Każdy pupil wychodzi od nas piękny i zadowolony!"
              as="span"
              multiline
            />
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
                index === 0 || index === 5 ? 'row-span-2' : ''
              }`}
              onClick={() => {
                if (editMode) return
                openLightbox(index)
              }}
            >
              <EditableImage
                src={image.src}
                alt={image.alt}
                wrapperClassName="relative"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 || index === 5 ? 'h-full min-h-[400px]' : 'h-48 md:h-56'
                }`}
                onSave={(next) => updateGalleryImage(image.id, { src: next })}
              />
              
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-primary-900/45 via-primary-900/10 to-transparent transition-opacity duration-300 ${
                  editMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                    <EditableText
                      value={image.category}
                      onSave={(next) => updateGalleryImage(image.id, { category: next })}
                      as="span"
                    />
                  </span>
                  <p className="text-white font-medium">
                    <EditableText
                      value={image.alt}
                      onSave={(next) => updateGalleryImage(image.id, { alt: next })}
                      as="span"
                    />
                  </p>
                </div>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation */}
              <button
                className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Caption */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                  {images[selectedImage].alt}{' '}
                  <EditableKeyText textKey="gallery.lightbox.separator" fallback="•" as="span" />{' '}
                  {selectedImage + 1}{' '}
                  <EditableKeyText textKey="gallery.lightbox.of" fallback="/" as="span" />{' '}
                  {images.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Gallery
