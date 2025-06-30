import React, {useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

interface PDFViewerProps {
    url: string
}
const PDFViewer = (props: PDFViewerProps) => {
    const [numPages, setNumPages] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
       preloadPDF()
    }, [props.url]);

    const preloadPDF = async () => {
        const loadingTask = pdfjs.getDocument(props.url);
        await loadingTask.promise;

        setIsReady(true);
    }
    // @ts-ignore
    const onLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    if(!isReady){
        return null
    }

    return (
        <Document file={props.url} onLoadSuccess={onLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
        </Document>
    );
};

export default PDFViewer;
