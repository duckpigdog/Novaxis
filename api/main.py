from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import io
import wave

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应替换为具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Novaxis API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

class MorseRequest(BaseModel):
    morse: str
    freq: int = 800
    dot_duration: int = 100

@app.post("/api/tools/morse-audio")
def generate_morse_audio(request: MorseRequest):
    """
    接收摩斯密码并生成对应的 WAV 音频流。
    - dot_duration: 点(.)的持续时间，单位为毫秒
    - freq: 正弦波的频率，单位 Hz
    """
    morse = request.morse
    sample_rate = 44100
    dot_sec = request.dot_duration / 1000.0
    freq = request.freq

    # 解析摩斯密码为时间单元
    tokens = []
    for char in morse:
        if char == '.':
            tokens.append({'type': 'tone', 'units': 1})
        elif char == '-':
            tokens.append({'type': 'tone', 'units': 3})
        elif char == ' ':
            tokens.append({'type': 'silence', 'units': 3})
        elif char == '/':
            tokens.append({'type': 'silence', 'units': 7})
            
    if not tokens:
        raise HTTPException(status_code=400, detail="Invalid morse code")

    # 插入字符内的空白(滴答之间的间隔 1 unit)
    final_tokens = []
    for i in range(len(tokens)):
        final_tokens.append(tokens[i])
        if tokens[i]['type'] == 'tone' and i < len(tokens) - 1 and tokens[i+1]['type'] == 'tone':
            final_tokens.append({'type': 'silence', 'units': 1})

    total_units = sum(t['units'] for t in final_tokens)
    total_samples = int(total_units * dot_sec * sample_rate)
    
    # 初始化音频数据数组
    audio_data = np.zeros(total_samples, dtype=np.float32)
    
    current_sample = 0
    for t in final_tokens:
        unit_samples = int(t['units'] * dot_sec * sample_rate)
        end_sample = current_sample + unit_samples
        
        if t['type'] == 'tone':
            # 生成正弦波
            time_array = np.arange(unit_samples) / sample_rate
            wave_data = np.sin(2 * np.pi * freq * time_array)
            
            # 添加包络线防止爆音 (Fade in / Fade out 5ms)
            fade_samples = int(0.005 * sample_rate)
            if fade_samples > unit_samples // 2:
                fade_samples = unit_samples // 2
                
            fade_in = np.linspace(0, 1, fade_samples)
            fade_out = np.linspace(1, 0, fade_samples)
            
            wave_data[:fade_samples] *= fade_in
            wave_data[-fade_samples:] *= fade_out
            
            audio_data[current_sample:end_sample] = wave_data
            
        current_sample = end_sample

    # 将 Float32 (-1.0 to 1.0) 转换为 Int16 (-32768 to 32767)
    audio_data_int16 = np.int16(audio_data * 32767)
    
    # 写入内存中的 WAV 文件
    wav_io = io.BytesIO()
    with wave.open(wav_io, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2) # 2 bytes = 16 bits
        wav_file.setframerate(sample_rate)
        # 确保将数据转换为字节
        wav_file.writeframes(audio_data_int16.tobytes())
        
    wav_io.seek(0)
    
    # 必须使用 yield 生成器返回以适配 StreamingResponse
    def iterfile():
        yield wav_io.getvalue()

    return StreamingResponse(
        iterfile(), 
        media_type="audio/wav", 
        headers={
            "Content-Disposition": "attachment; filename=morse_challenge.wav"
        }
    )
