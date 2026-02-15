// Loading component for blogs listing page
export default function BlogsLoading() {
    return (
        <main>
            {/* Header skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse" />

            {/* Blog cards skeleton */}
            <div className="max-w-[1980px] mx-auto p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                            <div className="h-48 bg-gray-200 animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
