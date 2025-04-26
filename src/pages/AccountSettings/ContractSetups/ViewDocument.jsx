import React, { useEffect, useState } from 'react'
import { Download, Eye, FileText, FolderOpen, Image, Sheet, Trash2, X } from 'lucide-react'

function ViewDocument({ setIsUploadModalOpen, documents, handleDeleteDocument }) {
    const [previewItem, setPreviewItem] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const FileIcon = ({ extension, className }) => {
        const iconMap = {
            pdf: <FileText className={className} />,
            doc: <FileText className={className} />,
            docx: <FileText className={className} />,
            xls: <Sheet className={className} />,
            xlsx: <Sheet className={className} />,
            jpg: <Image className={className} />,
            jpeg: <Image className={className} />,
            png: <Image className={className} />,
            default: <FileText className={className} />
        };

        return iconMap[extension?.toLowerCase()] || iconMap.default;
    };

    const isImageFile = (fileName) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        const extension = fileName.split('.').pop().toLowerCase()
        return imageExtensions.includes(extension)
    }

    const handleDownload = async (fileUrl, fileName) => {
        try {
            // Fetch the file as a blob
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download';
            link.style.display = 'none';

            // Trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to the traditional method if fetch fails
            const fallbackLink = document.createElement('a');
            fallbackLink.href = fileUrl;
            fallbackLink.download = fileName || 'download';
            fallbackLink.target = '_blank';
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
        }
    };

    // Reset states when preview changes
    useEffect(() => {
        setImageLoaded(false);
        setIframeLoaded(false);
    }, [previewItem]);

    return (
        <div className="space-y-4">
            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-medium text-lg">
                                {previewItem.original_name || previewItem.file_name}
                            </h3>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area with Fixed Height */}
                        <div className="relative flex-1 min-h-[60vh] overflow-auto flex items-center justify-center">
                            {isImageFile(previewItem.file_name) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Loading placeholder */}
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                                        </div>
                                    )}

                                    {/* Image */}
                                    <img
                                        src={previewItem.file_url}
                                        alt={previewItem.original_name}
                                        className={`max-w-full max-h-[70vh] h-[70vh] object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        // className="max-w-full max-h-[70vh] object-contain"
                                        style={{ transition: 'opacity 300ms ease-in-out' }}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageLoaded(false)}
                                    />
                                </div>
                            ) : (
                                <div className="h-full w-full">
                                    {/* Document viewer */}
                                    <iframe
                                        src={previewItem.file_url}
                                        className="w-full h-[70vh] border-0"
                                        title={previewItem.original_name}
                                        onLoad={() => setIframeLoaded(true)}
                                    />
                                    {!iframeLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => handleDownload(
                                    previewItem.file_url,
                                    previewItem.original_name || previewItem.file_name
                                )}
                                className="px-4 py-2 flex items-center gap-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Documents List */}
            {documents.length > 0 ? (
                <div className="border1 border-gray-200 rounded1-xl overflow-hidden shadow1-sm bg-white">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="group relative p-4 hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                            {/* Delete button */}
                            <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="absolute -top-0 right-3 p-1.5 text-gray-400 hover:text-red-500 
                                 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer
                                 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                                title="Delete document"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex-1 min-w-0 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <FileIcon
                                            extension={doc.file_name.split('.').pop()}
                                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="relative group min-w-0">
                                            <p className="font-medium text-gray-800 text-base break-all overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[180px] sm:max-w-[240px]">
                                                {doc.original_name || doc.file_name}
                                            </p>
                                            {(doc.original_name || doc.file_name).length > 20 && (
                                                <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                                                    {doc.original_name || doc.file_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1">
                                            <span className="px-1.5 py-0.5 bg-gray-100 rounded-md">{doc.file_type || 'Document'}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{doc.file_size}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex self-end sm:self-center space-x-1.5 ml-auto mt-5">
                                    <button
                                        onClick={() => setPreviewItem(doc)}
                                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 cursor-pointer"
                                        title="View document"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(
                                            doc.file_url,
                                            doc.original_name || doc.file_name
                                        )}
                                        className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-green-50 cursor-pointer"
                                        title="Download document"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <FolderOpen className="w-14 h-14 mx-auto text-gray-300" />
                    <p className="mt-3 text-gray-600 font-medium">No documents uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Drag & drop files or click to upload</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        Upload Documents
                    </button>
                </div>
            )}
        </div>
    )
}

export default ViewDocument