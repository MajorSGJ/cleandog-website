import { createContext, useContext, useState, useEffect } from 'react'
import { defaultData } from '../data/defaultData'

const DataContext = createContext()

// Save full data object to server (writes public/data.json)
const saveToServer = async (newData) => {
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
    if (!res.ok) throw new Error('Save failed')
    console.log('✅ Dane zapisane na serwerze')
    return true
  } catch (err) {
    console.error('❌ Błąd zapisu:', err)
    return false
  }
}

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(defaultData)
  const [hasChanges, setHasChanges] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // On mount: fetch /data.json (the single source of truth)
  useEffect(() => {
    fetch('/data.json?t=' + Date.now())
      .then(res => res.json())
      .then(json => {
        setData({ ...defaultData, ...json })
        setLoaded(true)
      })
      .catch(() => {
        console.warn('Nie udało się pobrać data.json, używam domyślnych danych')
        setLoaded(true)
      })
  }, [])

  // Helper: update state + save to server
  const persist = (newData) => {
    setData(newData)
    setHasChanges(true)
    saveToServer(newData)
  }

  const updateData = (section, newData) => {
    const updatedData = typeof newData === 'function' ? newData(data[section]) : newData
    persist({ ...data, [section]: updatedData })
  }

  const getText = (key, fallback = '') => {
    const value = data?.uiText?.[key]
    return typeof value === 'string' ? value : fallback
  }

  const setText = (key, value) => {
    persist({
      ...data,
      uiText: { ...(data.uiText || {}), [key]: value },
    })
  }

  const updateNestedData = (section, key, value) => {
    persist({
      ...data,
      [section]: { ...data[section], [key]: value },
    })
  }

  const addGalleryImage = (image) => {
    const newImage = { id: Date.now(), ...image }
    persist({ ...data, gallery: [...data.gallery, newImage] })
  }

  const updateGalleryImage = (id, updates) => {
    persist({
      ...data,
      gallery: data.gallery.map(img => img.id === id ? { ...img, ...updates } : img),
    })
  }

  const deleteGalleryImage = (id) => {
    persist({ ...data, gallery: data.gallery.filter(img => img.id !== id) })
  }

  const reorderGallery = (fromIndex, toIndex) => {
    const g = [...data.gallery]
    const [moved] = g.splice(fromIndex, 1)
    g.splice(toIndex, 0, moved)
    persist({ ...data, gallery: g })
  }

  const updateLocation = (id, updates) => {
    persist({
      ...data,
      locations: data.locations.map(loc => loc.id === id ? { ...loc, ...updates } : loc),
    })
  }

  const updateService = (id, updates) => {
    persist({
      ...data,
      services: data.services.map(svc => svc.id === id ? { ...svc, ...updates } : svc),
    })
  }

  const resetToDefault = () => {
    persist(defaultData)
    setHasChanges(false)
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleandog-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (jsonString) => {
    try {
      const imported = JSON.parse(jsonString)
      persist({ ...defaultData, ...imported })
      return { success: true }
    } catch (e) {
      return { success: false, error: 'Nieprawidłowy format pliku JSON' }
    }
  }

  return (
    <DataContext.Provider value={{
      data,
      loaded,
      hasChanges,
      setHasChanges,
      editMode,
      setEditMode,
      getText,
      setText,
      updateData,
      updateNestedData,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      reorderGallery,
      updateLocation,
      updateService,
      resetToDefault,
      exportData,
      importData,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
