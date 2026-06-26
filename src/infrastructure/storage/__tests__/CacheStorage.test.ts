import AsyncStorage from "@react-native-async-storage/async-storage";
import { CacheStorage } from "../CacheStorage";

const originalLog = console.log;
const originalWarn = console.warn;
beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
});
afterAll(() => {
  console.log = originalLog;
  console.warn = originalWarn;
});

jest.mock("@/core/constants/Config", () => ({
  Config: {
    CACHE: {
      ENABLED: true,
      META_SUFFIX: "_meta",
    },
  },
}));

describe("CacheStorage", () => {
  let cacheStorage: CacheStorage;

  beforeEach(() => {
    (AsyncStorage as any).__resetStore();
    jest.clearAllMocks();
    cacheStorage = CacheStorage.getInstance();
  });

  describe("Singleton Pattern", () => {
    it("debería retornar la misma instancia siempre", () => {
      const instance1 = CacheStorage.getInstance();
      const instance2 = CacheStorage.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("set and get", () => {
    it("debería guardar y recuperar datos correctamente", async () => {
      const testData = { id: 1, name: "Test" };
      const key = "test_key";
      const ttl = 60000;

      await cacheStorage.set(key, testData, ttl);
      const result = await cacheStorage.get(key);

      expect(result).toEqual(testData);
    });

    it("debería guardar datos con TTL infinito", async () => {
      const testData = { id: 2, name: "Forever" };
      const key = "forever_key";

      await cacheStorage.set(key, testData, Infinity);
      const result = await cacheStorage.get(key);

      expect(result).toEqual(testData);
    });

    it("debería retornar null si la clave no existe", async () => {
      const result = await cacheStorage.get("non_existent_key");

      expect(result).toBeNull();
    });

    it("debería retornar null si el cache expiró", async () => {
      const testData = { id: 3, name: "Expired" };
      const key = "expired_key";
      const ttl = 0;

      await cacheStorage.set(key, testData, ttl);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const result = await cacheStorage.get(key);

      expect(result).toBeNull();
    });

    it("debería guardar diferentes tipos de datos", async () => {
      await cacheStorage.set("string_key", "hello", 60000);
      expect(await cacheStorage.get("string_key")).toBe("hello");

      await cacheStorage.set("number_key", 42, 60000);
      expect(await cacheStorage.get("number_key")).toBe(42);

      await cacheStorage.set("array_key", [1, 2, 3], 60000);
      expect(await cacheStorage.get("array_key")).toEqual([1, 2, 3]);

      await cacheStorage.set("boolean_key", true, 60000);
      expect(await cacheStorage.get("boolean_key")).toBe(true);
    });
  });

  describe("has", () => {
    it("debería retornar true si el cache existe y no expiró", async () => {
      await cacheStorage.set("exists_key", { data: "test" }, 60000);

      const result = await cacheStorage.has("exists_key");

      expect(result).toBe(true);
    });

    it("debería retornar false si el cache no existe", async () => {
      const result = await cacheStorage.has("non_existent_key");

      expect(result).toBe(false);
    });

    it("debería retornar false si el cache expiró", async () => {
      await cacheStorage.set("expired_key", { data: "test" }, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const result = await cacheStorage.has("expired_key");

      expect(result).toBe(false);
    });
  });

  describe("clear", () => {
    it("debería eliminar una clave específica", async () => {
      await cacheStorage.set("clear_key", { data: "test" }, 60000);
      expect(await cacheStorage.has("clear_key")).toBe(true);

      await cacheStorage.clear("clear_key");
      expect(await cacheStorage.has("clear_key")).toBe(false);
    });

    it("debería eliminar tanto data como metadata", async () => {
      const key = "clear_both_key";
      await cacheStorage.set(key, { data: "test" }, 60000);

      await cacheStorage.clear(key);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`${key}_meta`);
    });
  });

  describe("clearByPrefix", () => {
    it("debería eliminar todas las claves con el prefijo dado", async () => {
      await cacheStorage.set("JOBS_1", { id: 1 }, 60000);
      await cacheStorage.set("JOBS_2", { id: 2 }, 60000);
      await cacheStorage.set("CATEGORIES_1", { id: 1 }, 60000);

      await cacheStorage.clearByPrefix("JOBS_");

      expect(await cacheStorage.has("JOBS_1")).toBe(false);
      expect(await cacheStorage.has("JOBS_2")).toBe(false);
      expect(await cacheStorage.has("CATEGORIES_1")).toBe(true);
    });

    it("debería eliminar data y metadata de las claves coincidentes", async () => {
      await cacheStorage.set("TEST_1", { id: 1 }, 60000);
      await cacheStorage.set("TEST_2", { id: 2 }, 60000);

      await cacheStorage.clearByPrefix("TEST_");

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        "TEST_1",
        "TEST_2",
        "TEST_1_meta",
        "TEST_2_meta",
      ]);
    });

    it("debería hacer nada si no hay claves con el prefijo", async () => {
      await cacheStorage.set("OTHER_1", { id: 1 }, 60000);

      await cacheStorage.clearByPrefix("TEST_");

      expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    });
  });

  describe("invalidateAll", () => {
    it("debería eliminar todas las claves del cache", async () => {
      await cacheStorage.set("KEY_1", { id: 1 }, 60000);
      await cacheStorage.set("KEY_2", { id: 2 }, 60000);
      await cacheStorage.set("KEY_3", { id: 3 }, 60000);

      await cacheStorage.invalidateAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
      expect(await cacheStorage.has("KEY_1")).toBe(false);
      expect(await cacheStorage.has("KEY_2")).toBe(false);
      expect(await cacheStorage.has("KEY_3")).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("debería manejar errores de lectura gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Read error"),
      );

      const result = await cacheStorage.get("error_key");

      expect(result).toBeNull();
    });

    it("debería manejar errores de escritura gracefully", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Write error"),
      );

      await expect(
        cacheStorage.set("error_key", { data: "test" }, 60000),
      ).resolves.not.toThrow();
    });

    it("debería manejar errores de eliminación gracefully", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error("Remove error"),
      );

      await expect(cacheStorage.clear("error_key")).resolves.not.toThrow();
    });
  });
});
