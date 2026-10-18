import React, { useState } from 'react';

interface AiStudioSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'music' | 'image' | 'video' | 'search';
}

export const AiStudioSuite: React.FC<AiStudioSuiteProps> = ({
  isOpen,
  onClose,
  defaultTab = 'music',
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'image' | 'video' | 'search'>(defaultTab);

  // ==========================================
  // TAB 1: MUSIC STATE (Lyria 3)
  // ==========================================
  const [musicPrompt, setMusicPrompt] = useState(
    'Atmospheric ambient soundscape with low basalt resonance, ceremonial bronze bells, and ethereal synthetic strings'
  );
  const [musicDuration, setMusicDuration] = useState<'clip' | 'full'>('clip');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setMusicError(null);
    try {
      const res = await fetch('/api/ai/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, duration: musicDuration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed generating music');
      if (data.audioData) {
        setGeneratedAudioUrl(data.audioData);
      } else if (data.simulated) {
        setMusicError(data.message);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setMusicError(e.message || 'Error occurred while contacting Lyria engine');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // ==========================================
  // TAB 2: IMAGE GENERATION & EDITING STATE (gemini-nano-banana-2.1)
  // ==========================================
  const [imagePrompt, setImagePrompt] = useState(
    'Brutalist monolithic architecture pavilion at dusk, raw cast basalt texture, oxblood silk canopy draping over cantilevered concrete, cinematic lighting'
  );
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          base64Image: uploadedImageBase64,
          aspectRatio: imageAspectRatio,
          imageSize: imageSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed generating image');
      setGeneratedImageUrl(data.imageUrl);
      setImageCaption(data.caption);
    } catch (err: unknown) {
      const e = err as Error;
      setImageError(e.message || 'Error communicating with Gemini Nano-Banana engine');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ==========================================
  // TAB 3: VIDEO GENERATION STATE (Veo)
  // ==========================================
  const [videoPrompt, setVideoPrompt] = useState(
    'Slow cinematic orbit around the brutalist stone monument as oxblood silk ribbons flutter dynamically in the wind'
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [uploadedVideoImage, setUploadedVideoImage] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleVideoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedVideoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);
    setVideoStatusMessage('Submitting request to Veo video generation pipeline...');

    try {
      const startRes = await fetch('/api/ai/video-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          base64Image: uploadedVideoImage,
          aspectRatio: videoAspectRatio,
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || 'Failed starting video job');

      const operationName = startData.operationName;
      setVideoStatusMessage('Synthesizing temporal frames and spatial camera trajectory with Veo...');

      // Polling loop
      let done = false;
      let attempts = 0;
      while (!done && attempts < 25) {
        attempts++;
        await new Promise((r) => setTimeout(r, 4000));
        setVideoStatusMessage(
          `Rendering cinematic video: frame pass ${attempts} / 25. Please wait, video synthesis takes 1-2 minutes...`
        );

        const statusRes = await fetch('/api/ai/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const statusData = await statusRes.json();
        if (statusData.done) {
          done = true;
          break;
        }
      }

      if (done) {
        setVideoStatusMessage('Finalizing MP4 video stream...');
        const dlRes = await fetch('/api/ai/video-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        if (!dlRes.ok) throw new Error('Failed to retrieve video stream');
        const blob = await dlRes.blob();
        setGeneratedVideoUrl(URL.createObjectURL(blob));
        setVideoStatusMessage('');
      } else {
        throw new Error('Video generation timed out. Please retry.');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setVideoError(e.message || 'Error during Veo generation');
      setVideoStatusMessage('');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // ==========================================
  // TAB 4: GOOGLE SEARCH GROUNDING (gemini-3.8-flash)
  // ==========================================
  const [searchQuery, setSearchQuery] = useState(
    'History of Indira Gandhi Delhi Technological University Kashmere Gate heritage campus and modern architecture'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed performing search');
      setSearchResults(data);
    } catch (err: unknown) {
      const e = err as Error;
      setSearchError(e.message || 'Error executing Google Search grounding query');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#141210] border-2 border-[#8E8271]/30 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#8E8271]/20 bg-[#1A1614]">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A1829] animate-pulse" />
            <div>
              <h3 className="font-display font-bold uppercase text-[#FAF8F5] text-sm sm:text-base tracking-wider">
                DESIGNVERSE AI LABORATORY
              </h3>
              <p className="text-[10px] text-[#8E8271] uppercase tracking-widest">
                Indira Gandhi Delhi Technological University • Multimodal Synthesis Suite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8271] hover:text-white p-2 text-sm uppercase transition"
          >
            [Close ✕]
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#8E8271]/20 bg-[#0F0D0C] overflow-x-auto text-[11px] uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('music')}
            className={`px-5 py-3 border-r border-[#8E8271]/20 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'music'
                ? 'bg-[#4A0E17] text-white font-bold border-b-2 border-b-[#D4AF37]'
                : 'text-[#8E8271] hover:text-[#FAF8F5]'
            }`}
          >
            <span>🎵</span>
            <span>Lyria Music Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`px-5 py-3 border-r border-[#8E8271]/20 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'image'
                ? 'bg-[#4A0E17] text-white font-bold border-b-2 border-b-[#D4AF37]'
                : 'text-[#8E8271] hover:text-[#FAF8F5]'
            }`}
          >
            <span>🎨</span>
            <span>Nano-Banana Image Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-5 py-3 border-r border-[#8E8271]/20 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-[#4A0E17] text-white font-bold border-b-2 border-b-[#D4AF37]'
                : 'text-[#8E8271] hover:text-[#FAF8F5]'
            }`}
          >
            <span>🎬</span>
            <span>Veo Kinetic Cinema</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-5 py-3 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-[#4A0E17] text-white font-bold border-b-2 border-b-[#D4AF37]'
                : 'text-[#8E8271] hover:text-[#FAF8F5]'
            }`}
          >
            <span>🔍</span>
            <span>Google Search Grounding</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#EDE7DC]">
          {/* TAB 1: LYRIA MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div>
                <span className="text-[#8A1829] font-bold uppercase text-[10px] tracking-widest block">
                  MODEL: lyria-3-clip-preview / lyria-3-pro-preview
                </span>
                <h4 className="text-xl font-serif text-[#FAF8F5] mt-1">
                  Synthesize Monograph Audio &amp; Soundscapes
                </h4>
                <p className="font-serif text-xs text-[#CFC2AC] leading-relaxed mt-1">
                  Generate bespoke algorithmic musical movements and spatial droneworks inspired by architectural forms and tectonic materiality.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-[#8E8271] tracking-wider">
                  Atmospheric Audio Prompt
                </label>
                <textarea
                  rows={3}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full bg-[#1A1614] border border-[#8E8271]/30 p-3 text-[#FAF8F5] text-xs focus:border-[#D4AF37] focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] uppercase text-[#8E8271]">Duration:</span>
                    <button
                      type="button"
                      onClick={() => setMusicDuration('clip')}
                      className={`px-3 py-1 border text-[10px] ${
                        musicDuration === 'clip'
                          ? 'border-[#8A1829] bg-[#4A0E17] text-white font-bold'
                          : 'border-[#8E8271]/30 text-[#8E8271]'
                      }`}
                    >
                      30s Clip (Lyria Clip)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMusicDuration('full')}
                      className={`px-3 py-1 border text-[10px] ${
                        musicDuration === 'full'
                          ? 'border-[#8A1829] bg-[#4A0E17] text-white font-bold'
                          : 'border-[#8E8271]/30 text-[#8E8271]'
                      }`}
                    >
                      Full Track (Lyria Pro)
                    </button>
                  </div>

                  <button
                    disabled={isGeneratingMusic}
                    onClick={handleGenerateMusic}
                    className="px-6 py-2.5 bg-[#8A1829] hover:bg-[#a82236] disabled:opacity-50 text-white font-bold tracking-widest uppercase transition flex items-center space-x-2"
                  >
                    <span>{isGeneratingMusic ? 'Synthesizing...' : 'Generate Music'}</span>
                    <span className="text-sm">♪</span>
                  </button>
                </div>
              </div>

              {musicError && (
                <div className="p-3 bg-red-900/30 border border-red-500 text-red-200 text-xs">
                  {musicError}
                </div>
              )}

              {generatedAudioUrl && (
                <div className="p-5 bg-black/50 border border-[#D4AF37] space-y-3">
                  <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider block">
                    ✓ Synthesized Audio Ready
                  </span>
                  <audio controls src={generatedAudioUrl} className="w-full h-10" autoPlay />
                  <div className="flex justify-between items-center text-[10px] text-[#8E8271] pt-2">
                    <span>Model: lyria-3-clip-preview</span>
                    <a
                      href={generatedAudioUrl}
                      download="designverse-theme.wav"
                      className="text-[#FAF8F5] underline hover:text-[#D4AF37]"
                    >
                      Download WAV File
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NANO BANANA IMAGE STUDIO */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              <div>
                <span className="text-[#8A1829] font-bold uppercase text-[10px] tracking-widest block">
                  MODEL: gemini-nano-banana-2.1 (Supports 1K / 2K)
                </span>
                <h4 className="text-xl font-serif text-[#FAF8F5] mt-1">
                  Architectural Synthesis &amp; Folio Cover Studio
                </h4>
                <p className="font-serif text-xs text-[#CFC2AC] leading-relaxed mt-1">
                  Synthesize new architectural concepts or upload a studio photograph/sketch to edit with high-fidelity PBR textures and lighting.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-[#8E8271] tracking-wider">
                  Text Prompt
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full bg-[#1A1614] border border-[#8E8271]/30 p-3 text-[#FAF8F5] text-xs focus:border-[#D4AF37] focus:outline-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Upload photo for editing */}
                  <div className="p-3 bg-black/40 border border-[#8E8271]/20 space-y-2">
                    <span className="text-[10px] text-[#8E8271] uppercase tracking-wider block">
                      Optional: Upload Reference Photo to Edit
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-[10px] text-[#CFC2AC] file:mr-3 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-[#4A0E17] file:text-white"
                    />
                    {uploadedImageBase64 && (
                      <div className="flex items-center space-x-2 pt-1">
                        <img
                          src={uploadedImageBase64}
                          alt="Upload preview"
                          className="w-12 h-12 object-cover border border-[#8E8271]/40"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImageBase64(null)}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="p-3 bg-black/40 border border-[#8E8271]/20 space-y-2 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E8271] uppercase">Aspect Ratio:</span>
                      <div className="space-x-1">
                        {(['16:9', '1:1', '9:16'] as const).map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setImageAspectRatio(ratio)}
                            className={`px-2 py-0.5 border ${
                              imageAspectRatio === ratio
                                ? 'bg-[#4A0E17] border-[#8A1829] text-white font-bold'
                                : 'border-[#8E8271]/30 text-[#8E8271]'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E8271] uppercase">Resolution:</span>
                      <div className="space-x-1">
                        {(['1K', '2K'] as const).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setImageSize(size)}
                            className={`px-2 py-0.5 border ${
                              imageSize === size
                                ? 'bg-[#4A0E17] border-[#8A1829] text-white font-bold'
                                : 'border-[#8E8271]/30 text-[#8E8271]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={isGeneratingImage}
                    onClick={handleGenerateImage}
                    className="px-6 py-2.5 bg-[#8A1829] hover:bg-[#a82236] disabled:opacity-50 text-white font-bold tracking-widest uppercase transition flex items-center space-x-2"
                  >
                    <span>{isGeneratingImage ? 'Rendering with Nano-Banana...' : 'Synthesize Image'}</span>
                    <span className="text-sm">✦</span>
                  </button>
                </div>
              </div>

              {imageError && (
                <div className="p-3 bg-red-900/30 border border-red-500 text-red-200 text-xs">
                  {imageError}
                </div>
              )}

              {generatedImageUrl && (
                <div className="p-4 bg-black/50 border border-[#D4AF37] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider">
                      ✓ Image Synthesis Complete
                    </span>
                    <a
                      href={generatedImageUrl}
                      download="designverse-render.png"
                      className="text-[#FAF8F5] underline hover:text-[#D4AF37] text-[10px]"
                    >
                      Download High-Res
                    </a>
                  </div>
                  <img
                    src={generatedImageUrl}
                    alt="AI Generated Architecture"
                    className="w-full max-h-[420px] object-contain border border-[#8E8271]/30"
                  />
                  {imageCaption && (
                    <p className="font-serif italic text-xs text-[#CFC2AC]">{imageCaption}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VEO KINETIC CINEMA */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div>
                <span className="text-[#8A1829] font-bold uppercase text-[10px] tracking-widest block">
                  MODEL: veo-3.1-fast-generate-preview (16:9 / 9:16)
                </span>
                <h4 className="text-xl font-serif text-[#FAF8F5] mt-1">
                  Animate Architectural Artifacts into Cinema
                </h4>
                <p className="font-serif text-xs text-[#CFC2AC] leading-relaxed mt-1">
                  Upload an exhibition still or monograph photograph to animate dynamic camera movements, fluid lighting transitions, and physical kinetics.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-[#8E8271] tracking-wider">
                  Motion &amp; Camera Prompt
                </label>
                <textarea
                  rows={2}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full bg-[#1A1614] border border-[#8E8271]/30 p-3 text-[#FAF8F5] text-xs focus:border-[#D4AF37] focus:outline-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Photo Upload */}
                  <div className="p-3 bg-black/40 border border-[#8E8271]/20 space-y-2">
                    <span className="text-[10px] text-[#8E8271] uppercase tracking-wider block">
                      Upload Source Image / Sketch *
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoImageUpload}
                      className="text-[10px] text-[#CFC2AC] file:mr-3 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-[#4A0E17] file:text-white"
                    />
                    {uploadedVideoImage && (
                      <div className="flex items-center space-x-2 pt-1">
                        <img
                          src={uploadedVideoImage}
                          alt="Video source"
                          className="w-12 h-12 object-cover border border-[#8E8271]/40"
                        />
                        <span className="text-[10px] text-emerald-400">✓ Image Loaded</span>
                      </div>
                    )}
                  </div>

                  {/* Aspect Ratio */}
                  <div className="p-3 bg-black/40 border border-[#8E8271]/20 space-y-2 text-[10px]">
                    <span className="text-[#8E8271] uppercase block">Cinema Aspect Ratio:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoAspectRatio('16:9')}
                        className={`flex-1 py-1.5 border text-center ${
                          videoAspectRatio === '16:9'
                            ? 'bg-[#4A0E17] border-[#8A1829] text-white font-bold'
                            : 'border-[#8E8271]/30 text-[#8E8271]'
                        }`}
                      >
                        16:9 (Landscape Cinema)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoAspectRatio('9:16')}
                        className={`flex-1 py-1.5 border text-center ${
                          videoAspectRatio === '9:16'
                            ? 'bg-[#4A0E17] border-[#8A1829] text-white font-bold'
                            : 'border-[#8E8271]/30 text-[#8E8271]'
                        }`}
                      >
                        9:16 (Vertical Reel)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={isGeneratingVideo}
                    onClick={handleGenerateVideo}
                    className="px-6 py-2.5 bg-[#8A1829] hover:bg-[#a82236] disabled:opacity-50 text-white font-bold tracking-widest uppercase transition flex items-center space-x-2"
                  >
                    <span>{isGeneratingVideo ? 'Processing with Veo...' : 'Generate Veo Video'}</span>
                    <span className="text-sm">▶</span>
                  </button>
                </div>
              </div>

              {videoStatusMessage && (
                <div className="p-4 bg-black/60 border border-[#D4AF37] text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-[#D4AF37]">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                    <span>{videoStatusMessage}</span>
                  </div>
                  <div className="w-full bg-[#2E0B11] h-1.5 overflow-hidden">
                    <div className="bg-[#8A1829] h-full animate-pulse w-3/4" />
                  </div>
                </div>
              )}

              {videoError && (
                <div className="p-3 bg-red-900/30 border border-red-500 text-red-200 text-xs">
                  {videoError}
                </div>
              )}

              {generatedVideoUrl && (
                <div className="p-4 bg-black/50 border border-[#D4AF37] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider">
                      ✓ Veo Video Rendered
                    </span>
                    <a
                      href={generatedVideoUrl}
                      download="designverse-veo.mp4"
                      className="text-[#FAF8F5] underline hover:text-[#D4AF37] text-[10px]"
                    >
                      Download MP4
                    </a>
                  </div>
                  <video
                    controls
                    autoPlay
                    loop
                    src={generatedVideoUrl}
                    className="w-full max-h-[440px] bg-black border border-[#8E8271]/30"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GOOGLE SEARCH GROUNDING */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <span className="text-[#8A1829] font-bold uppercase text-[10px] tracking-widest block">
                  MODEL: gemini-3.8-flash (with googleSearch tool)
                </span>
                <h4 className="text-xl font-serif text-[#FAF8F5] mt-1">
                  Scholarly Grounded Research Terminal
                </h4>
                <p className="font-serif text-xs text-[#CFC2AC] leading-relaxed mt-1">
                  Access real-time information and authenticated web citations grounded through Google Search regarding IGDTUW heritage, design history, materials, and convocation papers.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-[#8E8271] tracking-wider">
                  Research Topic or Query
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-[#1A1614] border border-[#8E8271]/30 p-3 text-[#FAF8F5] text-xs focus:border-[#D4AF37] focus:outline-none"
                    placeholder="e.g. Indira Gandhi Delhi Technological University history or brutalist architecture"
                  />
                  <button
                    disabled={isSearching}
                    onClick={handleSearch}
                    className="px-6 py-2.5 bg-[#8A1829] hover:bg-[#a82236] disabled:opacity-50 text-white font-bold tracking-widest uppercase transition whitespace-nowrap"
                  >
                    {isSearching ? 'Searching...' : 'Search Google'}
                  </button>
                </div>
              </div>

              {searchError && (
                <div className="p-3 bg-red-900/30 border border-red-500 text-red-200 text-xs">
                  {searchError}
                </div>
              )}

              {searchResults && (
                <div className="p-5 bg-black/50 border border-[#8E8271]/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#8E8271]/20 pb-2">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs">
                      Grounded Curatorial Digest
                    </span>
                    <span className="text-[#8E8271] text-[10px]">Grounded via Google Search</span>
                  </div>

                  <div className="font-serif text-sm leading-relaxed text-[#EDE7DC] whitespace-pre-line">
                    {searchResults.text}
                  </div>

                  {searchResults.sources && searchResults.sources.length > 0 && (
                    <div className="pt-3 border-t border-[#8E8271]/20">
                      <span className="text-[10px] uppercase text-[#8E8271] tracking-wider block mb-2">
                        Authentic Web Citations:
                      </span>
                      <ul className="space-y-1.5">
                        {searchResults.sources.map((s, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-xs">
                            <span className="text-[#D4AF37]">[{idx + 1}]</span>
                            <a
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#FAF8F5] underline hover:text-[#8A1829] truncate max-w-md"
                            >
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
