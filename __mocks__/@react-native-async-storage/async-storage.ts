const store: Record<string, string> = {};

const mockAsyncStorage = {
  getItem: jest.fn((key: string) => Promise.resolve(store[key] || null)),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((key) => delete store[key]);
    return Promise.resolve();
  }),
  multiGet: jest.fn((keys: string[]) =>
    Promise.resolve(keys.map((key) => [key, store[key] || null])),
  ),
  multiSet: jest.fn((keyValuePairs: [string, string][]) => {
    keyValuePairs.forEach(([key, value]) => {
      store[key] = value;
    });
    return Promise.resolve();
  }),
  // Helper para limpiar el store entre tests
  __resetStore: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
};

export default mockAsyncStorage;
