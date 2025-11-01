import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
            <div className="max-w-md text-center">
                {/* Optional SVG Illustration */}
                <svg
                    className="mx-auto mb-6 h-40 w-40 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 64 64"
                >
                    <path
                        d="M32 4C17.5 4 6 15.5 6 30s11.5 26 26 26 26-11.5 26-26S46.5 4 32 4z"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M32 20v14M32 42h.01"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
                <p className="mb-6 text-gray-400">
                    Oops! The link you followed may be broken, or the page has been removed.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-green-300 text-white hover:bg-gray-400 rounded-lg transition-colors duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
