import "@testing-library/jest-dom"

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver as any

window.HTMLElement.prototype.scrollIntoView = jest.fn()
window.scrollTo = jest.fn()

// Silence React act() warnings from Radix UI / cmdk components
const originalError = console.error

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    if (
      typeof args[0] === "string" &&
      (
        args[0].includes("not wrapped in act") ||
        args[0].includes("inside a test was not wrapped in act")
      )
    ) {
      return
    }

    originalError(...args)
  })
})