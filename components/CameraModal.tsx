"use client";

import { X, Camera, RotateCcw, Check, RefreshCw } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
    label: string;
}

export function CameraModal({ isOpen, onClose, onCapture, label }: CameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setPermissionError(false);
        } catch (err) {
            console.error("Camera error:", err);
            setPermissionError(true);
        }
    }, [facingMode]);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            setCapturedImage(null);
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, startCamera]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL('image/jpeg', 0.85);
                setCapturedImage(imageUrl);
            }
        }
    };

    const confirmPhoto = () => {
        if (capturedImage) {
            // Convert base64 to File
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
                    onCapture(file);
                    onClose();
                });
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-black/50 absolute top-0 w-full p-4 flex justify-between items-center z-20 backdrop-blur-sm">
                <div className="text-white">
                    <p className="font-bold text-lg">Capturar Documento</p>
                    <p className="text-xs opacity-80">{label}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {permissionError ? (
                    <div className="text-white text-center p-6">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-xl font-bold mb-2">Acesso Negado</h3>
                        <p className="text-sm opacity-80 mb-4">Precisamos da sua permissão para usar a câmera.</p>
                        <button onClick={onClose} className="bg-white text-black px-6 py-2 rounded-full font-bold">
                            Fechar
                        </button>
                    </div>
                ) : (
                    <>
                        {!capturedImage ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Framing Overlay/Gabarito */}
                                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50 z-10 flex items-center justify-center">
                                    <div className="w-full h-full border-2 border-white/50 rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gov-green-400 -mt-1 -ml-1"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gov-green-400 -mt-1 -mr-1"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gov-green-400 -mb-1 -ml-1"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gov-green-400 -mb-1 -mr-1"></div>
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                                            <p className="text-white/80 text-sm font-medium bg-black/40 inline-block px-3 py-1 rounded-full backdrop-blur-md">
                                                Encaixe o documento aqui
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-contain bg-black" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="bg-black/80 backdrop-blur-md p-6 pb-8 z-20">
                {!capturedImage ? (
                    <div className="flex justify-between items-center max-w-sm mx-auto">
                        <button onClick={() => { }} className="p-4 rounded-full text-white/50 hover:text-white" disabled>
                            {/* Placeholder for balance */}
                            <div className="w-6 h-6" />
                        </button>

                        <button
                            onClick={capturePhoto}
                            className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:bg-white/20 transition-all hover:scale-105"
                        >
                            <div className="h-16 w-16 bg-white rounded-full"></div>
                        </button>

                        <button onClick={toggleCamera} className="p-4 rounded-full text-white hover:bg-white/10 transition-all">
                            <RefreshCw className="h-6 w-6" />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center gap-4 max-w-sm mx-auto">
                        <button
                            onClick={retakePhoto}
                            className="flex-1 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            <RotateCcw className="h-5 w-5" />
                            Tirar Outra
                        </button>
                        <button
                            onClick={confirmPhoto}
                            className="flex-1 bg-gov-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gov-green-700 transition-all active:scale-95"
                        >
                            <Check className="h-5 w-5" />
                            Usar Foto
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
