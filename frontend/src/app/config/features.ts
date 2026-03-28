function readEnvFlag(value: string | undefined, defaultValue: boolean) {
  if (value == null || value.trim() === "") {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "on" || normalized === "yes";
}

export const appFeatureFlags = {
  demoExperience: readEnvFlag(import.meta.env.VITE_DEMO_MODE, true),
  showcaseMode: readEnvFlag(import.meta.env.VITE_SHOWCASE_MODE, true),
} as const;
