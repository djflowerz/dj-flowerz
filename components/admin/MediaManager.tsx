import React, { useState } from 'react';
import { uploadFile, deleteFile } from '../../services/insforge';
import { Button, GlassCard } from '../UI';
import { Upload, X, CheckCircle } from 'lucide-react';

interface MediaPreview {
    path: string;
    url: string;
}

interface MediaManagerProps {
    type: 'product' | 'music';
    onImagesChange: (images: MediaPreview[]) => void;
    initialImages?: MediaPreview[];
}

export const MediaManager: React.FC<MediaManagerProps> = ({ type, onImagesChange, initialImages = [] }) => {
    const [previews, setPreviews] = useState<MediaPreview[]>(initialImages);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);

        try {
            // For music/mixtapes, enforce single file; for products, allow multiple
            const fileList = type === 'music' ? [files[0]] : Array.from(files);

            const newUploads = await Promise.all(fileList.map(async (file) => {
                const folder = type === 'product' ? 'products' : 'covers';
                const result = await uploadFile(file, folder);
                return result;
            }));

            const updatedPreviews = type === 'music' ? newUploads : [...previews, ...newUploads];
            setPreviews(updatedPreviews);
            onImagesChange(updatedPreviews);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (path: string, index: number) => {
        try {
            // Delete from storage immediately
            await deleteFile(path);

            // Remove from preview list
            const updatedPreviews = previews.filter((_, i) => i !== index);
            setPreviews(updatedPreviews);
            onImagesChange(updatedPreviews);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete image.');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    {type === 'product' ? 'Upload Product Images (Multiple)' : 'Upload Cover Image (Single)'}
                </label>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? 'Uploading...' : 'Choose Files'}</span>
                        </div>
                        <input
                            type="file"
                            multiple={type === 'product'}
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    {uploading && <span className="text-sm text-gray-400">Processing...</span>}
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((img, i) => (
                        <div key={i} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                <img
                                    src={img.url}
                                    alt={`Preview ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => handleDelete(img.path, i)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors"
                                title="Delete image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500/90 text-white text-xs px-2 py-1 rounded">
                                <CheckCircle className="w-3 h-3" />
                                <span>Uploaded</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {previews.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-lg">
                    No images uploaded yet
                </div>
            )}
        </div>
    );
};
