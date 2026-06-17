'use client';
import { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { compressImage } from '@/lib/imageUtils';

interface Props {
  onAnalyze: (result: AnalysisResult, compressedDataUrl: string) => void;
}

export default function PhotoAnalyzer({ onAnalyze }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string;
      const compressed = await compressImage(raw);
      setPreview(compressed);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: preview }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? '解析に失敗しました');
      onAnalyze(await res.json(), preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析に失敗しました');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div className="flex gap-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <Camera size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">写真を撮る</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">画像を選ぶ</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="食事の写真" className="w-full h-56 object-cover rounded-2xl" />
            <button
              onClick={() => { setPreview(null); setError(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full"
            >
              変更
            </button>
          </div>
          <button
            onClick={analyze}
            disabled={analyzing}
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
          >
            {analyzing ? <><Loader2 size={18} className="animate-spin" />AI解析中...</> : 'AIで栄養素を解析する'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
    </div>
  );
}
