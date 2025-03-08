import React from 'react'

interface WrapperProps {
    children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
    )
}

export default Wrapper