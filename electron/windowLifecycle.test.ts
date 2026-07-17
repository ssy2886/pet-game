import { expect, it } from 'vitest'
import { shouldHideManagementWindow } from './windowLifecycle.js'

it('hides a management window close unless the app is quitting', () => {
  expect(shouldHideManagementWindow(false)).toBe(true)
  expect(shouldHideManagementWindow(true)).toBe(false)
})
