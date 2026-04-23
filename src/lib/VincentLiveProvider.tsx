import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Artwork, VoiceSessionState } from './constants';

interface VincentLiveContextType {
  state: VoiceSessionState;
  start: (artwork?: Artwork) => void;
  switchTopic: (artwork: Artwork) => void;
  stop: () => void;
  playNarration: (artworkId: number) => void;
  isNarrationPlaying: boolean;
}

const VincentLiveContext = createContext<VincentLiveContextType | null>(null);

export function VincentLiveProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VoiceSessionState>({
    status: 'idle',
    isMuted: false,
  });
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current = null;
      setIsNarrationPlaying(false);
    }
    setState(s => ({ ...s, status: 'idle', activeArtwork: undefined }));
  }, []);

  const start = useCallback(async (artwork?: Artwork) => {
    cleanup();
    setState(s => ({ ...s, status: 'connecting', activeArtwork: artwork }));

    try {
      // Initialize Audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/vangogh/voice-call`;
      
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        setState(s => ({ ...s, status: 'active' }));
        const initPayload = artwork ? {
          type: "init",
          pendingArtwork: {
            id: artwork.catalogNumber,
            title: artwork.titleFr,
            year: artwork.year,
            period: artwork.period,
            location: artwork.locationPainted,
            museum: artwork.currentMuseum,
            medium: artwork.medium,
            dimensions: artwork.dimensions,
            letterNumber: artwork.letterNumber || "",
            descriptionVincent: artwork.descriptionVincent || "",
            letterExcerpt: artwork.letterExcerpt || ""
          }
        } : { type: "init" };
        
        socketRef.current?.send(JSON.stringify(initPayload));
      };

      socketRef.current.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          // Assuming 16kHz Mono PCM 16-bit
          const float32Data = new Float32Array(arrayBuffer.byteLength / 2);
          const int16Data = new Int16Array(arrayBuffer);
          for (let i = 0; i < int16Data.length; i++) {
            float32Data[i] = int16Data[i] / 32768.0;
          }
          
          if (audioContextRef.current) {
            const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 16000);
            buffer.getChannelData(0).set(float32Data);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start();
          }
        }
      };

      socketRef.current.onerror = () => setState(s => ({ ...s, status: 'error' }));
      socketRef.current.onclose = () => cleanup();

      // Recording logic (simple implementation)
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      processor.onaudioprocess = (e) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
          }
          socketRef.current.send(pcmData.buffer);
        }
      };

    } catch (err) {
      console.error('Failed to start Vincent session:', err);
      setState(s => ({ ...s, status: 'error' }));
    }
  }, [cleanup]);

  const switchTopic = useCallback((artwork: Artwork) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setState(s => ({ ...s, activeArtwork: artwork }));
      socketRef.current.send(JSON.stringify({
        type: "focus_artwork",
        id: artwork.catalogNumber,
        title: artwork.titleFr,
        year: artwork.year,
        period: artwork.period,
        location: artwork.locationPainted,
        museum: artwork.currentMuseum,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        letterNumber: artwork.letterNumber || "",
        descriptionVincent: artwork.descriptionVincent || "",
        letterExcerpt: artwork.letterExcerpt || ""
      }));
    } else {
      start(artwork);
    }
  }, [start]);

  const playNarration = useCallback((artworkId: number) => {
    cleanup();
    setIsNarrationPlaying(true);
    const audio = new Audio(`/api/vangogh/memoir/${artworkId}?mode=full&lang=fr`);
    narrationRef.current = audio;
    audio.play();
    audio.onended = () => {
      setIsNarrationPlaying(false);
      narrationRef.current = null;
    };
  }, [cleanup]);

  return (
    <VincentLiveContext.Provider value={{ state, start, switchTopic, stop: cleanup, playNarration, isNarrationPlaying }}>
      {children}
    </VincentLiveContext.Provider>
  );
}

export function useVincent() {
  const context = useContext(VincentLiveContext);
  if (!context) throw new Error('useVincent must be used within VincentLiveProvider');
  return context;
}
