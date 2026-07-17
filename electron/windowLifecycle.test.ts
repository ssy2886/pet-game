import { expect, it } from 'vitest'
import { getOverlayUrl, shouldHideManagementWindow } from './windowLifecycle.js'

it('hides a management window close unless the app is quitting', () => {
  expect(shouldHideManagementWindow(false)).toBe(true)
  expect(shouldHideManagementWindow(true)).toBe(false)
})

it('builds a valid overlay URL from the Vite development origin', () => {
  expect(getOverlayUrl('http://localhost:3000')).toBe('http://localhost:3000/pet-overlay.html')
})
