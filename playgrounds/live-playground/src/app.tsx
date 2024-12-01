import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import { MakeTenoxUI } from 'tenoxui'
import type { CoreConfig } from 'tenoxui'
import { init, tenoxuiConfig } from './utils/styler'

export function App() {
  init()

  const [htmlContent, setHtmlContent] = useState('<div class="bg-red-600 box-200px"></div>')
  const previewRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const previewElement = previewRef.current
    if (!previewElement) return

    const initializeTenoxUI = (config: CoreConfig) => {
      previewElement.querySelectorAll('*').forEach((element) => {
        new MakeTenoxUI({
          element: element as HTMLElement,
          ...config
        }).useDOM()
      })
    }
    previewElement.innerHTML = htmlContent

    try {
      initializeTenoxUI(tenoxuiConfig)
    } catch (error) {
      console.error('Error initializing TenoxUI:', error)
    }
  }, [htmlContent])

  return (
    <main class="p-2rem">
      <div ref={previewRef} class="p-1rem bdr-[1px_solid_#333]"></div>
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.currentTarget.value)}
        class="mt-1rem"
        placeholder="Enter HTML here..."
      />
    </main>
  )
}

export default App
