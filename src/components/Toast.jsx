import { useEffect, useState } from 'react'

// Basit toast: `message` değiştiğinde 2.6 sn görünür.
export default function Toast({ message }) {
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!message) return
    setText(message.text)
    setShow(true)
    const t = setTimeout(() => setShow(false), 2600)
    return () => clearTimeout(t)
  }, [message])

  if (!text) return null
  return <div className={`toast ${show ? 'show' : ''}`}>{text}</div>
}
