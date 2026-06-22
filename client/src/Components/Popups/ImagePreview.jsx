import React from 'react'
import { X } from 'lucide-react'

function ImagePreview({ src, setImagePreviewOpen }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/40 backdrop-blur-md"
    >
      {/* Close button */}
      <button
        onClick={() => setImagePreviewOpen(false)}
        className="absolute top-5 right-5 p-2 rounded-full 
                   bg-white/10 hover:bg-white/20 transition"
      >
        <X className="text-white" size={28} />
      </button>

      {/* Image */}
      <img
        src={src}
        alt="preview"
        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl object-contain"
      />
    </div>
  )
}

export default ImagePreview