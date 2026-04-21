export const safeParse = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  export const createPersistedState = (key, fallback, read, write) => {
    const init = () => {
      const saved = read(key);
      return safeParse(saved, fallback);
    };
  
    const persist = (value) => {
      try {
        write(key, JSON.stringify(value));
      } catch (e) {
        console.error("Persist failed:", e);
      }
    };
  
    return { init, persist };
  };