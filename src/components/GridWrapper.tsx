import React from 'react'

interface GridWrapperProps {
    children: React.ReactNode;
}

const GridWrapper: React.FC<GridWrapperProps> = ({ children }) => {
    return (
        <div className="media-cards grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2 px-4 xl:px-0">
            {children}
        </div>
    )
}

export default GridWrapper