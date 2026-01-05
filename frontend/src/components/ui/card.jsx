import React from 'react'

export const Card = ({ className = '', ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props} />
)

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`border-b border-gray-200 px-6 py-4 ${className}`} {...props} />
)

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
)

export const CardDescription = ({ className = '', ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props} />
)

export const CardContent = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props} />
)
