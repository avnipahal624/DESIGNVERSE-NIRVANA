import { useEffect, useRef } from 'react';

interface FluidCanvasProps {
  className?: string;
}

export function FluidCanvas({ className = 'absolute inset-0 w-full h-full pointer-events-none' }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    syncSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 5; i++) {
    f += w * snoise(p);
    p *= 2.02;
    w *= 0.5;
  }
  return f;
}

float getFluid(vec2 p, vec2 m_centered, float t, out vec2 flowDir) {
  float dMouse = length(p - m_centered);
  float mouseInfluence = smoothstep(0.85, 0.05, dMouse);
  
  vec2 q = vec2(0.0);
  q.x = fbm(p + vec2(0.0, 0.0) + vec2(t * 0.4, t * 0.25));
  q.y = fbm(p + vec2(5.2, 1.3) + vec2(-t * 0.35, t * 0.3));

  vec2 mouseDir = (p - m_centered);
  q += mouseDir * mouseInfluence * 0.45;
  flowDir = q;

  vec2 r = vec2(0.0);
  r.x = fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t);
  r.y = fbm(p + 3.0 * q + vec2(8.3, 2.8) + 0.12 * t);

  float fluidMask = fbm(p + 3.5 * r);
  return clamp(fluidMask * 0.5 + 0.5, 0.0, 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  vec2 m_centered = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.18;

  vec2 flowVec;
  float baseFluid = getFluid(p, m_centered, t, flowVec);

  float flowMag = length(flowVec);
  float dMouse = length(p - m_centered);
  float mouseProximity = smoothstep(0.9, 0.05, dMouse);
  
  float aberrationStrength = 0.035 * (flowMag * 1.5 + mouseProximity * 0.8);
  vec2 dispDir = normalize(flowVec + vec2(0.001));

  vec2 dummyFlow;
  float fluidR = getFluid(p + dispDir * aberrationStrength, m_centered, t, dummyFlow);
  float fluidG = getFluid(p, m_centered, t, dummyFlow);
  float fluidB = getFluid(p - dispDir * (aberrationStrength * 0.65), m_centered, t, dummyFlow);

  vec3 cVoid = vec3(0.051, 0.043, 0.039);
  vec3 cCharcoal = vec3(0.09, 0.08, 0.07);
  vec3 cStone = vec3(0.42, 0.38, 0.33);
  vec3 cOxblood = vec3(0.45, 0.08, 0.13);
  vec3 cIvory = vec3(0.95, 0.93, 0.89);

  vec3 color = mix(cVoid, cCharcoal, smoothstep(0.1, 0.6, fluidG));
  color = mix(color, cStone * 0.5, mouseProximity * 0.35);

  float fringeRed = clamp(fluidR - fluidG, 0.0, 1.0);
  float fringeBlue = clamp(fluidB - fluidG, 0.0, 1.0);

  color += cOxblood * (smoothstep(0.02, 0.45, fringeRed) * 2.2);
  color += vec3(0.12, 0.18, 0.28) * (smoothstep(0.02, 0.45, fringeBlue) * 1.1);

  float coreOxblood = smoothstep(0.38, 0.82, flowMag) * 0.85;
  color = mix(color, cOxblood, coreOxblood);

  float specular = pow(baseFluid, 4.0) * 0.42;
  color += cIvory * specular;

  float edgeFade = smoothstep(0.0, 0.12, st.y) * smoothstep(1.0, 0.88, st.y);
  
  gl_FragColor = vec4(color, 0.85 * edgeFade);
}`;

    function compileShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const startTime = performance.now();
    function render() {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      const elapsed = (performance.now() - startTime) * 0.001;
      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
