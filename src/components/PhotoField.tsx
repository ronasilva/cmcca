'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Strings = {
  take: string
  upload: string
  capture: string
  cancel: string
  retake: string
  error: string
}

/**
 * Photo field with two equal options: "take a photo now" (in-page camera via
 * getUserMedia — works on laptops and phones) and "upload a file"
 * (picker/gallery). Both attach to the same hidden file input, so the server
 * action sees a normal upload either way. `required={false}` makes it
 * optional (e.g. profile editing, where empty keeps the current photo).
 */
export function PhotoField({
  name,
  strings,
  required = true,
}: {
  name: string
  strings: Strings
  required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [camera, setCamera] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  useEffect(() => {
    if (camera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [camera])

  useEffect(
    () => () => {
      stopStream()
    },
    []
  )

  const openCamera = async () => {
    setError(false)
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 } },
        audio: false,
      })
      setCamera(true)
    } catch {
      setError(true)
    }
  }

  const closeCamera = () => {
    stopStream()
    setCamera(false)
  }

  const capture = () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    // Center-crop to a square so the stored photo matches exactly what
    // the square viewfinder shows.
    const side = Math.min(video.videoWidth, video.videoHeight)
    const out = Math.min(side, 1200)
    const sx = (video.videoWidth - side) / 2
    const sy = (video.videoHeight - side) / 2
    const canvas = document.createElement('canvas')
    canvas.width = out
    canvas.height = out
    canvas.getContext('2d')?.drawImage(video, sx, sy, side, side, 0, 0, out, out)
    canvas.toBlob(
      (blob) => {
        if (!blob || !inputRef.current) return
        const file = new File([blob], 'foto-camera.jpg', {
          type: 'image/jpeg',
        })
        const dt = new DataTransfer()
        dt.items.add(file)
        inputRef.current.files = dt.files
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old)
          return URL.createObjectURL(blob)
        })
        closeCamera()
      },
      'image/jpeg',
      0.9
    )
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return URL.createObjectURL(f)
    })
  }

  const buttonClass =
    'cursor-pointer rounded-sm border border-espresso/30 bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-espresso transition hover:border-terracotta hover:text-terracotta'

  return (
    <div className="flex flex-col gap-3">
      {/* sr-only (not display:none) so required-validation can focus it */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        required={required}
        onChange={onFileChange}
        tabIndex={-1}
        className="sr-only"
      />
      {!camera && (
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={openCamera} className={buttonClass}>
            {previewUrl ? strings.retake : strings.take}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={buttonClass}
          >
            {strings.upload}
          </button>
        </div>
      )}

      {error && (
        <p className="font-display text-sm italic text-espresso-2">
          {strings.error}
        </p>
      )}

      {camera && (
        <div className="flex max-w-md flex-col gap-3">
          <video
            ref={videoRef}
            playsInline
            muted
            className="aspect-square w-full max-w-xs rounded-sm border border-espresso/15 bg-background object-cover"
          />
          <div className="flex gap-4">
            <button type="button" onClick={capture} className={buttonClass}>
              {strings.capture}
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-espresso"
            >
              {strings.cancel}
            </button>
          </div>
        </div>
      )}

      {previewUrl && !camera && (
        <Image
          src={previewUrl}
          alt=""
          width={160}
          height={160}
          unoptimized
          className="h-32 w-32 rounded-sm border border-espresso/15 object-cover"
        />
      )}
    </div>
  )
}
