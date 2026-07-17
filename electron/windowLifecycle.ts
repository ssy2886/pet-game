export function shouldHideManagementWindow(isQuitting: boolean): boolean {
  return !isQuitting
}

export function getOverlayUrl(viteOrigin: string): string {
  return `${viteOrigin.replace(/\/$/, '')}/pet-overlay.html`
}
