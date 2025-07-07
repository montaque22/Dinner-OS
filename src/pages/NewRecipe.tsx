import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import { getSavedURLFromLocalStorage } from '../utils'
import { marked } from 'marked'
import { Dialog } from '@headlessui/react'

function NewRecipe() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const [url] = useState(getSavedURLFromLocalStorage())
    const [showModal, setShowModal] = useState(false)
    const [didSucceed, setDidSucceed] = useState(false)
    const [savedResponse, setSavedResponse] = useState('')
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')

    const handleSave = () => {
        let hasError = false

        if (!title.trim()) {
            setTitleError('Title is required')
            hasError = true
        } else {
            setTitleError('')
        }

        if (!content.trim()) {
            setContentError('Recipe content is required')
            hasError = true
        } else {
            setContentError('')
        }

        if (hasError) return

        setSaving(true)

        fetch(`${url}/create_recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `${title}.md`,
                content
            }),
        })
            .then(res =>  res.json())
            .then(() => {
                setDidSucceed(true)
                setSavedResponse('Saved successfully')
                setShowModal(true)
            })
            .catch((err: Error) => {
                setDidSucceed(false)
                setSavedResponse('An error occurred while saving the recipe.')
                setShowModal(true)
            })
            .finally(() => {
                setSaving(false)
            })
    }

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        placeholder: 'Write your recipe in markdown...',
        status: false,
        previewRender: (plainText: string) => {
            return plainText ? marked.parse(plainText) as string : ''
        },
    }), [])

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    disabled={saving}
                    className={`absolute left-0 text-blue-600 text-xl font-semibold flex items-center ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {/*@ts-ignore*/}
                    <FiArrowLeft />
                    Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">New Recipe</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`absolute right-0 px-4 py-2 rounded-md text-sm font-medium transition ${
                        saving
                            ? 'bg-purple-300 text-white cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                    Save
                </button>
            </div>

            {/* Title Input */}
            <div className="mb-2">
                {titleError && (
                    <p className="text-red-500 text-sm mb-1">{titleError}</p>
                )}
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Recipe Title"
                    disabled={saving}
                    className={`w-full p-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        titleError ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
            </div>

            {/* Markdown WYSIWYG */}
            <div className="mt-4">
                {contentError && (
                    <p className="text-red-500 text-sm mb-1">{contentError}</p>
                )}
                <SimpleMDE
                    value={content}
                    onChange={saving ? () =>{} : setContent}
                    options={editorOptions}
                />
            </div>

            {/* Success/Error Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen bg-black/40 p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">

                        {didSucceed ? (
                                // @ts-ignore
                            <FiCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
                        ) : (
                            // @ts-ignore
                            <FiXCircle className="mx-auto h-16 w-16 text-red-500 animate-pulse" />
                        )}
                        <Dialog.Title className="text-lg font-medium mt-4">Done!</Dialog.Title>
                        <p className="text-gray-600 mb-4">{savedResponse}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            {didSucceed && (
                                <button
                                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                                    onClick={() => navigate(`/recipe/${encodeURIComponent(`${title}.md`)}`)}
                                >
                                    View Recipe
                                </button>
                            )}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Loading Modal */}
            <Dialog open={saving} onClose={() => {}} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen bg-black/40 p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Saving your recipe magic...</p>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    )
}

export default NewRecipe
