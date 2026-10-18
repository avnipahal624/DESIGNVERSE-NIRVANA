import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ==========================================
// API 1: Google Search Grounding (gemini-3.8-flash)
// ==========================================
app.post('/api/ai/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        text: `[Grounded Research Response for: "${query}"]\n\nIndira Gandhi Delhi Technological University (IGDTUW), situated at the historic Kashmere Gate heritage campus in Old Delhi, is recognized as India's premier women's technical and architectural research institution. The DESIGNVERSE monograph explores algorithmic spatial design, material culture, and computational synthesis at the intersection of heritage architecture and futuristic digital realms.`,
        sources: [
          { title: 'IGDTUW Official Portal', uri: 'https://www.igdtuw.ac.in' },
          { title: 'Kashmere Gate Heritage & Architecture Archive', uri: 'https://delhiheritage.gov.in' },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the lead curatorial researcher for DESIGNVERSE at Indira Gandhi Delhi Technological University (IGDTUW). Answer this design, architecture, or technology research query with scholarly depth and grounded citations:\n\n${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Array<{ title: string; uri: string }> = [];

    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }
    }

    res.json({ text, sources });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Search grounding error:', err);
    res.status(500).json({ error: err.message || 'Error executing search grounding' });
  }
});

// ==========================================
// API 2: Image Generation & Editing (gemini-nano-banana-2.1)
// ==========================================
app.post('/api/ai/image', async (req, res) => {
  try {
    const { prompt, base64Image, mimeType = 'image/jpeg', aspectRatio = '1:1', imageSize = '1K' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: `[Simulated Preview]: Architectural concept for "${prompt}". Configure GEMINI_API_KEY for live nano-banana-2.1 rendering.`,
      });
    }

    let contentsPayload;
    if (base64Image) {
      // Editing existing image
      contentsPayload = {
        parts: [
          {
            inlineData: {
              data: base64Image.replace(/^data:[^;]+;base64,/, ''),
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      };
    } else {
      // New Image generation
      contentsPayload = {
        parts: [{ text: prompt }],
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: contentsPayload,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '16:9' | '9:16' | '3:4' | '4:3',
          imageSize: imageSize as '1K' | '2K' | '4K',
        },
      },
    });

    let imageUrl: string | null = null;
    let textCaption = '';

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textCaption += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Model generated no image output', details: textCaption });
    }

    res.json({ imageUrl, caption: textCaption });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Image generation error:', err);
    res.status(500).json({ error: err.message || 'Error generating image with gemini-nano-banana-2.1' });
  }
});

// ==========================================
// API 3: Music Generation (lyria-3-clip-preview)
// ==========================================
app.post('/api/ai/music', async (req, res) => {
  try {
    const { prompt, duration = 'clip' } = req.body;
    const modelName = duration === 'full' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    if (!prompt) {
      return res.status(400).json({ error: 'Music prompt is required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        simulated: true,
        message: `Lyria 3 clip requires active API key. Synthesized ambient drone is active via Web Audio.`,
      });
    }

    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ error: 'No audio generated by Lyria' });
    }

    res.json({
      audioData: `data:${mimeType};base64,${audioBase64}`,
      lyrics,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Music generation error:', err);
    res.status(500).json({ error: err.message || 'Error generating music with Lyria' });
  }
});

// ==========================================
// API 4: Veo Video Generation (veo-3.1-fast-generate-preview)
// ==========================================
app.post('/api/ai/video-start', async (req, res) => {
  try {
    const { prompt, base64Image, mimeType = 'image/jpeg', aspectRatio = '16:9' } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        operationName: 'simulated-operation-id',
        message: 'Simulated operation started. Provide API key for real Veo rendering.',
      });
    }

    const videoConfig = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as '16:9' | '9:16',
    };

    let operation;
    if (base64Image) {
      const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, '');
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || 'Animate this architectural model with dynamic cinematic camera flythrough',
        image: {
          imageBytes: cleanBase64,
          mimeType: mimeType,
        },
        config: videoConfig,
      });
    } else {
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || 'Brutalist concrete architecture emerging in a futuristic desert landscape at twilight',
        config: videoConfig,
      });
    }

    res.json({ operationName: operation.name });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Video start error:', err);
    res.status(500).json({ error: err.message || 'Failed to start video generation' });
  }
});

app.post('/api/ai/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'Operation name is required' });
    }

    if (operationName === 'simulated-operation-id' || !apiKey) {
      return res.json({ done: true, simulated: true });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Video status check error:', err);
    res.status(500).json({ error: err.message || 'Failed checking video status' });
  }
});

app.post('/api/ai/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'Operation name is required' });
    }

    if (operationName === 'simulated-operation-id' || !apiKey) {
      // Return a simulated video demo link or redirect
      return res.json({
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'No video URI found in completed operation' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    res.setHeader('Content-Type', 'video/mp4');
    videoRes.body!.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      })
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Video download error:', err);
    res.status(500).json({ error: err.message || 'Failed downloading video' });
  }
});

// ==========================================
// Serve Vite frontend in dev or dist in prod
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[DESIGNVERSE] Fullstack server running at http://0.0.0.0:${port}`);
  });
}

startServer();
