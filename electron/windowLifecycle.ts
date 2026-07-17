export function shouldHideManagementWindow(isQuitting: boolean): boolean {
  return !isQuitting
}
