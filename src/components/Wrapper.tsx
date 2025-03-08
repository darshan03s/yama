import React from 'react'

interface WrapperProps {
    children: React.ReactNode
    className?: string
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    return (
        <div className={`max-w-6xl mx-auto ${className}`}>
            {children}
        </div>
    )
}

export default Wrapper