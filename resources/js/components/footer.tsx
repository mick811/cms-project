export function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Laravel. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
