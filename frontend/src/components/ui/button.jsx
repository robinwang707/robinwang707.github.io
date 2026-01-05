import React from 'react'

export const Button = React.forwardRef(({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none'
  
  const variants = {
    default: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
})

Button.displayName = 'Button'
