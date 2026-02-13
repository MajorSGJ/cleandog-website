import EditableText from './EditableText'
import { useData } from '../../context/DataContext'

const EditableKeyText = ({ textKey, fallback = '', as = 'span', className, multiline = false, placeholder }) => {
  const { getText, setText } = useData()

  return (
    <EditableText
      value={getText(textKey, fallback)}
      onSave={(next) => setText(textKey, next)}
      as={as}
      className={className}
      multiline={multiline}
      placeholder={placeholder || fallback}
    />
  )
}

export default EditableKeyText
