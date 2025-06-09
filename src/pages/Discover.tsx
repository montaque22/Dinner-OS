// pages/Discover.tsx
import { useNavigate } from 'react-router-dom'
import {
    MainContainer,
    MessageContainer,
    MessageInput,
    MessageList,
    MinChatUiProvider,
} from "@minchat/react-chat-ui";
import { useState } from "react";
import MessageType from "@minchat/react-chat-ui/dist/types/MessageType";
import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {getSavedURLFromLocalStorage} from "../utils";

const generate = (text: string, name: string, id: string) => {
    return { text, user: { id, name } }
}

function Discover() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState<MessageType[]>([])
    const [id] = useState("my_id")
    const [name] = useState(localStorage.getItem("firstName") || "Family Member")
    const [waiting, setWaiting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [savedName, setSavedName] = useState('')
    const [savedResponse, setSavedResponse] = useState('')
    const [didSucceed, setDidSucceed] = useState<boolean>(false)
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

    const saveRecipe = () => {
        fetch(`${url}/savedinner`, {
            method: "POST",
            body: JSON.stringify(messages),
        })
            .then((res) => res.json())
            .then((data: { name?: string, success: boolean, response: string }) => {
                setSavedResponse(data.response)
                setSavedName(data.name || "")
                setDidSucceed(data.success)
                setShowModal(true)
            })
            .catch((err: Error) => console.log(err))
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="relative flex items-center justify-center gap-4 mb-4 p-4 border-b shadow-sm bg-white">
                <button
                    onClick={() => navigate('/')}
                    className="absolute left-4 text-blue-600 text-xl font-semibold"
                >
                    ← Back
                </button>
                <h2 className="text-xl font-bold text-gray-800">Discover Recipes</h2>
                <button
                    className="absolute right-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    onClick={saveRecipe}
                >
                    Save Recipe
                </button>
            </div>

            {/* Chat UI */}
            <div className="flex-1 flex justify-center items-center px-4 pb-4">
                <div className="w-full  bg-message-grey shadow rounded-xl border overflow-hidden">
                    <MinChatUiProvider theme="#6ea9d7">
                        <MainContainer style={{ height: "80vh" }}>
                            <MessageContainer>
                                <MessageList
                                    typingIndicatorContent={"Agent is typing..."}
                                    showTypingIndicator={waiting}
                                    currentUserId={id}
                                    messages={messages}
                                />
                                <MessageInput
                                    showSendButton={true}
                                    showAttachButton={false}
                                    placeholder="Ask for dinner ideas..."
                                    onSendMessage={createMessage}
                                />
                            </MessageContainer>
                        </MainContainer>
                    </MinChatUiProvider>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen bg-black/40 p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
                        <Icon className={`mx-auto h-16 w-16 ${didSucceed ? "text-green-500 animate-bounce" : "text-red-500 animate-pulse"} `} />
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
        </div>
    )
}

export default Discover;
