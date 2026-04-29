// src/lib/planet-styles.ts

export const PLANET_ORB_STYLES: Record<string, string> = {
  Jupiter: 'radial-gradient(circle at 30% 30%, #F4D58A, #B68830 70%, #6B4D14)',
  Venus: 'radial-gradient(circle at 30% 30%, #F8EFD0, #D4B97A 70%, #7A5E2E)',
  Mercury: 'radial-gradient(circle at 30% 30%, #C9C2B0, #8E8775 70%, #4A4338)',
  Mars: 'radial-gradient(circle at 30% 30%, #F0876A, #B83C20 70%, #5A1B0A)',
  Saturn: 'radial-gradient(circle at 30% 30%, #F0DC9A, #BC9648 70%, #6B5020)',
  Moon: 'radial-gradient(circle at 30% 30%, #D8D8DC, #8A8A92 70%, #3F3F44)',
  Uranus: 'radial-gradient(circle at 30% 30%, #B5D8DC, #5C8C92 70%, #2A4448)',
  Neptune: 'radial-gradient(circle at 30% 30%, #6FA0E0, #2D5A9C 70%, #142A52)',
};

export function getOrbStyle(name: string): string {
  return PLANET_ORB_STYLES[name] ?? 'radial-gradient(circle at 30% 30%, #888, #444 70%, #222)';
}
