export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform vec2 uOffset;
uniform vec2 uResolution;
uniform vec4 uBorderColor;
uniform vec4 uHoverColor;
uniform vec4 uBackgroundColor;
uniform vec2 uMousePos;
uniform float uZoom;
uniform float uCellSize;
uniform float uTextureCount;
uniform sampler2D uImageAtlas;
uniform sampler2D uTextAtlas;

varying vec2 vUv;

vec2 getCellUV(vec2 worldPos) {
  vec2 cellPos = floor(worldPos / uCellSize);
  vec2 localPos = fract(worldPos / uCellSize);
  return localPos;
}

float getCellIndex(vec2 worldPos) {
  vec2 cellPos = floor(worldPos / uCellSize);
  return mod(cellPos.x + cellPos.y * 3.0, uTextureCount);
}

vec2 getAtlasUV(float index, vec2 uv, float atlasSize) {
  float x = mod(index, atlasSize);
  float y = floor(index / atlasSize);
  return (vec2(x, y) + uv) / atlasSize;
}

void main() {
  vec2 uv = vUv;
  vec2 worldPos = (uv - 0.5) * 2.0 * uZoom + uOffset;
  
  float cellIndex = getCellIndex(worldPos);
  vec2 cellUV = getCellUV(worldPos);
  
  // Sample from texture atlas
  float atlasSize = ceil(sqrt(uTextureCount));
  vec2 imageUV = getAtlasUV(cellIndex, cellUV, atlasSize);
  vec2 textUV = getAtlasUV(cellIndex, cellUV, atlasSize);
  
  vec4 imageColor = texture2D(uImageAtlas, imageUV);
  vec4 textColor = texture2D(uTextAtlas, textUV);
  
  // Border effect
  vec2 borderUV = fract(worldPos / uCellSize);
  float border = 1.0 - smoothstep(0.0, 0.05, min(borderUV.x, borderUV.y));
  border *= 1.0 - smoothstep(0.95, 1.0, max(borderUV.x, borderUV.y));
  
  // Hover effect
  float hoverDist = length(uMousePos - gl_FragCoord.xy);
  float hover = 1.0 - smoothstep(0.0, 100.0, hoverDist);
  
  vec4 finalColor = mix(imageColor, uHoverColor, hover * 0.3);
  finalColor = mix(finalColor, uBorderColor, border);
  
  gl_FragColor = finalColor;
}
`;
