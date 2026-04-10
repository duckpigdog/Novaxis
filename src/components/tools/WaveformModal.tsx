import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Play, Activity } from 'lucide-react';
import lamejs from 'lamejs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WaveformModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [morse, setMorse] = useState('.... . .-.. .-.. ---');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 清理逻辑
  useEffect(() => {
    if (!isOpen) {
      setAudioBuffer(null);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    }
  }, [isOpen]);

  const generateAudio = () => {
    const dotDuration = 0.1; // 点长度 100ms
    const sampleRate = 44100;
    const freq = 800; // 频率 800Hz

    // 1. 解析输入的摩斯密码
    const tokens: { type: string; units: number }[] = [];
    for (const char of morse) {
      if (char === '.') tokens.push({ type: 'tone', units: 1 });
      else if (char === '-') tokens.push({ type: 'tone', units: 3 });
      else if (char === ' ') tokens.push({ type: 'silence', units: 3 });
      else if (char === '/') tokens.push({ type: 'silence', units: 7 });
    }

    // 2. 插入字符内空白 (滴答之间的间隔)
    const finalTokens: { type: string; units: number }[] = [];
    for (let i = 0; i < tokens.length; i++) {
      finalTokens.push(tokens[i]);
      if (tokens[i].type === 'tone' && i < tokens.length - 1 && tokens[i + 1].type === 'tone') {
        finalTokens.push({ type: 'silence', units: 1 });
      }
    }

    let totalUnits = 0;
    finalTokens.forEach((t) => (totalUnits += t.units));

    if (totalUnits === 0) return;

    // 3. 生成音频数据
    const totalDuration = totalUnits * dotDuration;
    const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const offlineCtx = new OfflineCtx(1, Math.ceil(sampleRate * totalDuration), sampleRate);
    const buffer = offlineCtx.createBuffer(1, Math.ceil(sampleRate * totalDuration), sampleRate);
    const channelData = buffer.getChannelData(0);

    let currentUnit = 0;
    for (const t of finalTokens) {
      if (t.type === 'tone') {
        const startSample = Math.floor(currentUnit * dotDuration * sampleRate);
        const endSample = Math.floor((currentUnit + t.units) * dotDuration * sampleRate);
        for (let j = startSample; j < endSample; j++) {
          const time = j / sampleRate;
          channelData[j] = Math.sin(2 * Math.PI * freq * time);
          // 添加极短的包络线避免爆音 (Envelope)
          const fadeSamples = Math.floor(0.005 * sampleRate);
          if (j - startSample < fadeSamples) {
            channelData[j] *= (j - startSample) / fadeSamples;
          } else if (endSample - j < fadeSamples) {
            channelData[j] *= (endSample - j) / fadeSamples;
          }
        }
      }
      currentUnit += t.units;
    }

    setAudioBuffer(buffer);
    drawWaveform(buffer);
  };

  // 绘制类似 Audacity 的波形图
  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    
    // Audacity 暗色主题背景
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    // Audacity 亮蓝色/青色波形
    ctx.fillStyle = '#00ffcc';
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  const playAudio = () => {
    if (!audioBuffer) return;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => setIsPlaying(false);
    source.start();
    setIsPlaying(true);
  };

  const downloadAudio = async () => {
    try {
      const response = await fetch('/api/tools/morse-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          morse: morse,
          freq: 800,
          dot_duration: 100
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'morse_challenge.wav';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载音频失败，请确保后端服务正常运行。');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">波形图出题生成器</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">摩斯密码序列 (支持 `.` 和 `-`，空格分隔)</label>
            <textarea
              value={morse}
              onChange={(e) => setMorse(e.target.value)}
              className="h-24 w-full rounded-lg border border-slate-300 p-3 font-mono text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder=".... . .-.. .-.. ---"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">波形预览 (Audacity 样式)</label>
              <button
                onClick={generateAudio}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                生成波形
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#1e1e2e] shadow-inner">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="h-48 w-full object-cover"
              />
            </div>
            {!audioBuffer && (
              <p className="mt-2 text-center text-xs text-slate-500">点击“生成波形”查看预览</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={playAudio}
              disabled={!audioBuffer || isPlaying}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isPlaying ? '播放中...' : '播放预览'}
            </button>
            <button
              onClick={downloadAudio}
              disabled={!morse.trim()}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              下载 WAV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};