// Loading component for tour detail page
export default function TourDetailLoading() {
    return (
        <main className="pt-24 bg-[#F2F2F2]">
            {/* Gallery skeleton */}
            <div className="h-96 bg-gray-200 animate-pulse" />

            <div className="max-w-[1980px] mx-auto p-5">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Content skeleton */}
                    <div className="flex-1 space-y-6">
                        <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />

                        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mt-8" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Booking panel skeleton */}
                    <div className="w-full lg:w-96 space-y-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-64 bg-gray-200 rounded animate-pulse" />
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
