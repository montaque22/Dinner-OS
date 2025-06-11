import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { DEFAULT_DINNER_AI_URL } from '../config'
import {getSavedURLFromLocalStorage, setSavedURLToLocalStorage} from "../utils";
import logo from "../logo_square_small.png"
function Home() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [inputName, setInputName] = useState('')
    const [serverUrl, setServerUrl] = useState('')
    const [inputUrl, setInputUrl] = useState('')
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const savedName = localStorage.getItem('firstName')
        const savedUrl = getSavedURLFromLocalStorage()

        if (savedName) setName(savedName)
        if (savedUrl) {
            setServerUrl(savedUrl)
        } else {
            // fallback to default if not found
            setSavedURLToLocalStorage()
            setServerUrl(DEFAULT_DINNER_AI_URL)
        }
    }, [])

    const handleSubmit = () => {
        if (inputName.trim()) {
            localStorage.setItem('firstName', inputName.trim())
            setName(inputName.trim())
        }

        if (inputUrl.trim()) {
            setSavedURLToLocalStorage(inputUrl.trim())
            setServerUrl(inputUrl.trim())
        }

        setShowModal(false)
    }

    return (
        <div className="min-h-screen bg-light-bg flex flex-col">
            {/* Header */}
            <div className="bg-white shadow p-4 flex items-center justify-between">
                <div className="w-1/3"></div>
                <div className="w-1/3 text-center text-lg font-medium text-gray-700">
                    {name ? `Hello, ${name}` : 'Dinner OS'}
                </div>
                <div className="w-1/3 flex justify-end">
                    <button
                        onClick={() => {
                            setInputName(name)
                            setInputUrl(serverUrl)
                            setShowModal(true)
                        }}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                    >{/*@ts-ignore*/}
                        {name ? <FiEdit2 size={20} /> : 'Settings'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <img src={logo} alt=""/>
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Dinner OS</h1>
                    <p className="text-gray-500 mt-2 text-lg">Your personal AI meal planner</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
                    <button
                        onClick={() => navigate('/discover')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium transition"
                    >
                        🍽️ Discover New Recipes
                    </button>
                    <button
                        onClick={() => navigate('/favorites')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-medium transition"
                    >
                        📖 Explore Old Favorites
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customize Settings</h2>

                        <label className="block mb-2 text-sm text-gray-600">Your First Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="e.g. Michael"
                        />

                        <label className="block mb-2 text-sm text-gray-600">Dinner OS AI Server URL</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="http://your-ai-server:port"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
