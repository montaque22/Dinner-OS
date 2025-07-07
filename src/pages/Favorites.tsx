import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiInbox } from 'react-icons/fi'
import { Dialog } from '@headlessui/react'
import { getSavedURLFromLocalStorage } from '../utils'

function Favorites() {
    const navigate = useNavigate()
    const [filenames, setFilenames] = useState<string[]>([])
    const [selected, setSelected] = useState<string[]>([])
    const [selectMode, setSelectMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
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
                    setError('')
                } else if (message) {
                    setError(message)
                } else {
                    setFilenames(files)
                    setError('')
                }
            })
            .catch(error => {
                setError(error.toString())
            })
            .finally(() => setLoading(false))
    }, [url, selectMode])

    const toggleSelection = (file: string) => {
        if (!selectMode) return navigate(`/recipe/${encodeURIComponent(file)}`)

        setSelected(prev =>
            prev.includes(file)
                ? prev.filter(f => f !== file)
                : [...prev, file]
        )
    }

    const handleDeleteSelected = () => {
        console.log('Deleting:', selected)
        setShowDeleteModal(false)
        const promiseArray = selected.map(recipe => {
            setLoading(true)
            return fetch(`${url}/delete_recipe`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: recipe })
            }).then(res => res.json())
        })

        Promise.all(promiseArray)
            .then(() => {
                setSelected([])
                setSelectMode(false)
            })
            .catch(error => setError(error.toString()))
            .finally(() => setLoading(false))
    }

    const renderRecipeList = () => {
        let items = filenames
        if (!selectMode) {
            items = ['__phantom__', ...filenames]
        }

        if (items.length) {
            return items.map((file, idx) => {
                if (file === '__phantom__') {
                    return (
                        <div
                            key="phantom"
                            onClick={() => navigate('/new-recipe')}
                            className="cursor-pointer border-2 border-dashed border-purple-400 rounded-xl p-4 bg-white hover:bg-purple-50 transition text-center flex flex-col justify-center items-center"
                        >
                            <span className="text-xl text-purple-600 font-semibold">+ Add Recipe</span>
                        </div>
                    )
                }

                const isSelected = selected.includes(file)
                return (
                    <div
                        key={idx}
                        onClick={() => toggleSelection(file)}
                        className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 
                            ${selectMode ? 'bg-gray-100' : 'bg-white'}
                            ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-gray-200'}
                            hover:shadow-md hover:bg-purple-50`}
                    >
                        <h3 className="text-lg font-semibold text-purple-700 truncate">
                            {file.replace('.md', '')}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {selectMode ? 'Click to select' : 'Tap to view recipe'}
                        </p>
                    </div>
                )
            })
        }

        return (
            <div className="flex flex-col items-center justify-center text-center py-16 col-span-full">
                {/*@ts-ignore*/}
                <FiInbox className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">No recipes yet</p>
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

                <div className="absolute right-0 flex gap-2">
                    {!selectMode ? (
                        <button
                            onClick={() => setSelectMode(true)}
                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-200"
                        >
                            Select
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setSelectMode(false)
                                    setSelected([])
                                }}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={selected.length === 0}
                                onClick={() => setShowDeleteModal(true)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                    selected.length === 0
                                        ? 'bg-red-200 text-red-500 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {loading && <p className="text-gray-500 text-center">Loading recipes...</p>}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4 text-sm text-center">
                    There was a problem loading your recipes: {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderRecipeList()}
            </div>

            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen bg-black/40 p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
                        <Dialog.Title className="text-lg font-semibold mb-2">Confirm Deletion</Dialog.Title>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to delete <strong>{selected.length}</strong> recipe
                            {selected.length > 1 ? 's' : ''}? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={handleDeleteSelected}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    )
}

export default Favorites
