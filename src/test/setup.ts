/// <reference types="vitest/globals" />
import "@testing-library/jest-dom";
import "../i18n"; // Initialize i18next before all tests

// Node 22+ provides a global localStorage that may lack standard Storage methods,
// which conflicts with jsdom. Replace with a Map-backed full Storage API that
// inherits from Storage.prototype so that mocking Storage.prototype methods works.
const store = new Map<string, string>();
const storage: Storage = Object.create(Storage.prototype);
storage.getItem = (key: string) => store.get(key) ?? null;
storage.setItem = (key: string, value: string) => { store.set(key, value); };
storage.removeItem = (key: string) => { store.delete(key); };
storage.clear = () => { store.clear(); };
Object.defineProperty(storage, "length", { get() { return store.size; }, configurable: true });
storage.key = (index: number) => [...store.keys()][index] ?? null;
Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  writable: true,
  configurable: true,
});

// Mock matchMedia for theme-related tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
