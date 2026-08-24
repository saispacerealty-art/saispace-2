import {
  Search,
  Handshake,
  ShieldCheck,
  Building2,
  Target,
  Award,
  Users,
  Home,
  Megaphone,
  KeyRound,
  ScrollText,
  LineChart,
  Landmark,
  Star,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Handshake,
  ShieldCheck,
  Building2,
  Target,
  Award,
  Users,
  Home,
  Megaphone,
  KeyRound,
  ScrollText,
  LineChart,
  Landmark,
  Star,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Building2;
}
