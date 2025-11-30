export interface Theme {
  id: string;
  name: string;
  background: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Deep Ocean",
    background: "bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628]",
    gradientFrom: "from-[#0a1628]",
    gradientVia: "via-[#1a2942]",
    gradientTo: "to-[#0a1628]",
  },
  {
    id: "midnight",
    name: "Midnight",
    background: "bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]",
    gradientFrom: "from-[#0f0f1e]",
    gradientVia: "via-[#1a1a2e]",
    gradientTo: "to-[#0f0f1e]",
  },
  {
    id: "forest",
    name: "Forest",
    background: "bg-gradient-to-br from-[#0d2818] via-[#1a4d2e] to-[#0d2818]",
    gradientFrom: "from-[#0d2818]",
    gradientVia: "via-[#1a4d2e]",
    gradientTo: "to-[#0d2818]",
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "bg-gradient-to-br from-[#2d1b1b] via-[#4a2c1a] to-[#1a0f0f]",
    gradientFrom: "from-[#2d1b1b]",
    gradientVia: "via-[#4a2c1a]",
    gradientTo: "to-[#1a0f0f]",
  },
  {
    id: "neon",
    name: "Neon",
    background: "bg-gradient-to-br from-[#1a001a] via-[#330033] to-[#0d000d]",
    gradientFrom: "from-[#1a001a]",
    gradientVia: "via-[#330033]",
    gradientTo: "to-[#0d000d]",
  },
  {
    id: "aurora",
    name: "Aurora",
    background: "bg-gradient-to-br from-[#001a3d] via-[#0d2d5c] to-[#001a3d]",
    gradientFrom: "from-[#001a3d]",
    gradientVia: "via-[#0d2d5c]",
    gradientTo: "to-[#001a3d]",
  },
];

export function getTheme(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}

export function getThemeFromStorage(): Theme {
  const saved = localStorage.getItem("theme");
  return getTheme(saved || "default");
}

export function setThemeInStorage(id: string) {
  localStorage.setItem("theme", id);
}
