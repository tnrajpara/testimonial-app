import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-[#2C2C30] rounded-md ${className}`}
            {...props}
        />
    )
}
