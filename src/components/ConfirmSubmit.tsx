'use client'

// Submit button that asks for confirmation first — for irreversible
// actions like permanently deleting a member's ficha.
export function ConfirmSubmit({
  message,
  className,
  children,
}: {
  message: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
