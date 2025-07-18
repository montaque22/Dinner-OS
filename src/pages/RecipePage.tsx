import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import {getSavedURLFromLocalStorage} from "../utils";
import PDFViewer from "../components/PDFViewer";
import ErrorBoundary from '../components/ErrorBoundary';

function RecipePage() {
    const navigate = useNavigate()
    const { name } = useParams<{ name: string }>()
    const [content, setContent] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [url] = useState(getSavedURLFromLocalStorage())
    const [pdfUrl, setPdfUrl] = useState("");

    useEffect(() => {
        if (!name) return

        setLoading(true)
        fetch(`${url}/load_recipe?name=${encodeURIComponent(name)}`)
            .then(res => res.blob())
            .then((response) => {
              if(name.includes(".pdf")){
                  return URL.createObjectURL(response);
              }else{
                  return response.text()
              }
            }).then((text = "") => {
            if(name.includes(".pdf")){
                setPdfUrl(text);
            }else{
                setContent(text)
            }
            setError('')
        })
            .catch(err => setError(err.toString()))
            .finally(() => setLoading(false))
    }, [name, url])

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-6">
                <button
                    onClick={() => navigate('/favorites')}
                    className="absolute left-0 text-blue-600 text-xl font-semibold flex items-center"
                >
                    {/*@ts-ignore*/}
                    <FiArrowLeft className="mr-1" />
                    Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800 truncate max-w-[75%] text-center">
                    {name?.replace('.md', '') || 'Recipe'}
                </h2>
            </div>

            {/* States */}
            {loading && (
                <p className="text-center text-gray-500 mt-8">Loading recipe...</p>
            )}
            {error && (
                <div className="flex flex-col items-center text-red-600 mt-8">
                    {/*@ts-ignore*/}
                    <FiAlertCircle className="text-3xl mb-2" />
                    <p className="text-sm font-medium">
                        There was a problem loading your recipe:
                    </p>
                    <p className="text-xs italic">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="prose prose-purple max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 mt-4">
                    {!!content &&  <MarkdownPreview source={content}/>}
                    <ErrorBoundary>
                        {pdfUrl && <PDFViewer url={pdfUrl}/>}
                    </ErrorBoundary>
                </div>
            )}
        </div>
    )
}

export default RecipePage
