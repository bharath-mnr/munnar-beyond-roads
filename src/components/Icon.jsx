//src/components/Icon.jsx
import {
  BedDouble,
  Camera,
  Car,
  Clock,
  Compass,
  Heart,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Tent,
  Truck,
  Users,
  Video,
} from "lucide-react";

// Explicit map keeps the bundle small (no wildcard icon import).
const ICONS = {
  BedDouble,
  Camera,
  Car,
  Clock,
  Compass,
  Heart,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Tent,
  Truck,
  Users,
  Video,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Compass;
  return <Cmp {...props} />;
}
