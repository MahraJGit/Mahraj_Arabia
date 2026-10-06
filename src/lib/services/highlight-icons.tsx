import {
  Activity,
  Award,
  CheckCircle2,
  Dumbbell,
  Heart,
  Home,
  Layers,
  Shield,
  Sparkles,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const HIGHLIGHT_ICONS = {
  dumbbell: { label: "Fitness", icon: Dumbbell },
  activity: { label: "Performance", icon: Activity },
  users: { label: "People", icon: Users },
  shield: { label: "Protection", icon: Shield },
  heart: { label: "Comfort", icon: Heart },
  zap: { label: "Impact", icon: Zap },
  wrench: { label: "Installation", icon: Wrench },
  sparkles: { label: "Finish", icon: Sparkles },
  check: { label: "Quality", icon: CheckCircle2 },
  layers: { label: "Layers", icon: Layers },
  home: { label: "Space", icon: Home },
  award: { label: "Warranty", icon: Award },
} as const satisfies Record<string, { label: string; icon: LucideIcon }>;

export type HighlightIconName = keyof typeof HIGHLIGHT_ICONS;

export const HIGHLIGHT_ICON_NAMES = Object.keys(HIGHLIGHT_ICONS) as HighlightIconName[];

export function isHighlightIcon(value: string): value is HighlightIconName {
  return value in HIGHLIGHT_ICONS;
}

export function highlightIcon(value: string | undefined, index = 0): LucideIcon {
  if (value && isHighlightIcon(value)) return HIGHLIGHT_ICONS[value].icon;
  return HIGHLIGHT_ICONS[HIGHLIGHT_ICON_NAMES[index % HIGHLIGHT_ICON_NAMES.length]].icon;
}

export function highlightIconName(value: string | undefined, index = 0): HighlightIconName {
  if (value && isHighlightIcon(value)) return value;
  return HIGHLIGHT_ICON_NAMES[index % HIGHLIGHT_ICON_NAMES.length];
}
