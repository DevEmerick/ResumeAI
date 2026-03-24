import { usePathname } from "next/navigation";

export function useActivePath(paths: string[]): string | null {
  const pathname = usePathname();
  if (!pathname) return null;
  for (const path of paths) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return path;
    }
  }
  return null;
}
