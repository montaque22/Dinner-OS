// pages/Discover.tsx
import { useNavigate } from 'react-router-dom'
import {useEffect, useState} from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {getSavedURLFromLocalStorage} from "../utils";
import {Message, MessageChat} from "../components/MessageChat";

const LIMIT = 100;
const generate = (text: string, name: string, id: string) => {
    return { text, user: { id, name } }
}

function Discover() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Message[]>([])
    const [id] = useState("my_id")
    const [name] = useState(localStorage.getItem("firstName") || "Family Member")
    const [waiting, setWaiting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [savedName, setSavedName] = useState('')
    const [savedResponse, setSavedResponse] = useState('')
    const [didSucceed, setDidSucceed] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState(false)
    const [shouldSelect, setShouldSelect] = useState<boolean>(false)
    const [selectedRecipe, setSelectedRecipe] = useState<Message | undefined>()
    const [url] = useState(getSavedURLFromLocalStorage())
    const Icon = didSucceed ? CheckCircleIcon : XCircleIcon

    const createMessage = (message: string) => {
        const user = generate(message, name, id)
        setMessages([...messages, user])
        setWaiting(true)
        fetch(`${url}/dinnerchat`, {
            method: "POST",
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((responses: { agent: string} ) => {
                const systemResponses = [generate(responses.agent, "Agent", "agent")]
                setMessages((prev) => [...prev, ...systemResponses])
            })
            .catch((error: Error) => console.log(error))
            .finally(() => setWaiting(false))
    }

    const becomeSelectable = () => {
        if(shouldSelect){
            setSelectedRecipe(undefined)
        }
        setShouldSelect(!shouldSelect)
    }


    const saveRecipe = () => {
        setIsSaving(true)
        fetch(`${url}/savedinner`, {
            method: "POST",
            body: JSON.stringify([selectedRecipe]),
        })
            .then((res) => res.json())
            .then((data: { name?: string, success: boolean, response: string }) => {
                setSavedResponse(data.response)
                setSavedName(data.name || "")
                setDidSucceed(data.success)
                setShowModal(true)
            })
            .catch((err: Error) => console.log(err))
            .finally(() => {
                setIsSaving(false)
                setShouldSelect(false)
                setSelectedRecipe(undefined)
            })
    }

    useEffect(() => {
        if( messages.length === 0 ){
            // We need to check if we should load chat from local storage
            let savedMessageString = localStorage.getItem("chat") || "[]"
            const savedMessage = JSON.parse(savedMessageString)

            // To avoid an infinite useEffect loop we only update the messages if there was something in local storage
            if(savedMessage.length > 0){
                setMessages(savedMessage)
            }
        }else{
            // Otherwise when there's a new message...
            const storedMessages = messages.length > LIMIT ? messages.slice(-LIMIT) : messages
            // Update the local storage with the last N messages
            localStorage.setItem("chat", JSON.stringify(storedMessages))
        }
    }, [messages])

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div
                className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center gap-4 p-4 border-b shadow-sm bg-white">

                <button
                    onClick={() => navigate('/')}
                    className="absolute left-4 text-blue-600 text-xl font-semibold"
                >
                    ← Back
                </button>
                <h2 className="text-xl font-bold text-gray-800">Discover Recipes</h2>
                <div className="absolute right-4 flex gap-2">
                    {!shouldSelect && (
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                            onClick={becomeSelectable}
                        >
                            Select Recipe
                        </button>
                    )}
                    {shouldSelect && (
                        <>
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={becomeSelectable}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                                onClick={saveRecipe}
                                disabled={!selectedRecipe || isSaving}
                            >
                                Save Recipe
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Chat UI */}
            <div className="mt-[60px] h-[calc(100vh-60px)] overflow-y-hidden">
                <MessageChat chat={messages} isTyping={waiting} onSubmit={createMessage} selectable={shouldSelect} onSelect={setSelectedRecipe}/>
            </div>

            {/* Success Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen bg-black/40 p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
                        <Icon
                            className={`mx-auto h-16 w-16 ${didSucceed ? "text-green-500 animate-bounce" : "text-red-500 animate-pulse"} `}/>
                        <Dialog.Title className="text-lg font-medium mt-4">Done!</Dialog.Title>
                        <p className="text-gray-600 mb-4">{savedResponse}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            {didSucceed && <button
                                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => navigate(`/recipe/${encodeURIComponent(savedName)}`)}
                            >
                                View Recipe
                            </button>}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Loading Modal */}
            <Dialog open={isSaving} onClose={() => {}} className="fixed inset-0 z-50">
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

export default Discover;
