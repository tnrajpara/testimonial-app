import { Skeleton } from "../components/TestimonialSkeleton"

export function TestimonialSkeleton() {
    return (
        <div className="flex flex-col py-5 space-y-4 lg:mx-6 lg:my-5 mx-3 my-3 rounded-2xl bg-primary-color px-6">
            {/* Rating and Like Button */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-6 h-6 rounded-full" />
                    ))}
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>

            {/* Content */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Image attachments */}
            <div className="flex space-x-2">
                {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-md" />
                ))}
            </div>

            {/* User Details */}
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>

                {/* Extra Details */}
                <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

