import type { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'outline'
  children: ReactNode
}

export function Card({ variant = 'surface', className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card card--${variant} ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
