import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiInbox } from 'react-icons/fi'
import {getSavedURLFromLocalStorage} from "../utils";

function Favorites() {
    const navigate = useNavigate()
    const [filenames, setFilenames] = useState<string[]>([])
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [url] = useState(getSavedURLFromLocalStorage())
    useEffect(() => {
        setLoading(true)
        fetch(`${url}/list_recipes`)
            .then(res => res.json())
            .then((response: { files: string[], message: string, errorCode: number }) => {
                const { files = [], message, errorCode } = response
                setFilenames([])
                if (errorCode === 40400) {
                    setError("")
                } else if (message) {
                    setError(message)
                } else {
                    setFilenames(files)
                    setError("")
                }
            })
            .catch(error => {
                setError(error.toString())
            })
            .finally(() => setLoading(false))
    }, [url])

    const renderRecipeList = () => {
        if (filenames.length) {
            return filenames.map((file, idx) => (
                <div
                    key={idx}
                    onClick={() => navigate(`/recipe/${encodeURIComponent(file)}`)}
                    className="cursor-pointer border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200 hover:bg-purple-50"
                >
                    <h3 className="text-lg font-semibold text-purple-700 truncate">
                        {file.replace('.md', '')}
                    </h3>
                    <p className="text-sm text-gray-500">Tap to view recipe</p>
                </div>
            ))
        }

        return (
            <div className="flex flex-col items-center justify-center text-center py-16 col-span-full">
                {/*@ts-ignore*/}
                <FiInbox className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                    No recipes yet
                </p>
                <p className="text-gray-500 text-sm max-w-md">
                    Head over to the discovery page and save some recipes, or add them directly to the <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">recipes</code> folder in Obsidian.
                </p>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="absolute left-0 text-blue-600 text-xl font-semibold flex items-center"
                >
                    {/*@ts-ignore*/}
                   <FiArrowLeft />
                    Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Old Favorites</h2>
            </div>

            {/* Loading and Error States */}
            {loading && <p className="text-gray-500 text-center">Loading recipes...</p>}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4 text-sm text-center">
                    There was a problem loading your recipes: {error}
                </div>
            )}

            {/* Recipe List or Empty State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderRecipeList()}
            </div>
        </div>
    )
}

export default Favorites
