export const defaultStorage = window.localStorage

export const deleteDataStorage = (key: string) => {
  defaultStorage.removeItem(key)
}

export const deleteAllDataStorage = () => {
  defaultStorage.clear()
}

export const saveDataToStorage = (key: string, data: object) => {
  defaultStorage.setItem(key, JSON.stringify(data))
}

export const saveValueToStorage = (key: string, data: string) => {
  defaultStorage.setItem(key, data)
}

export const getValueFromStorage = (key: string) => {
  try {
    const data = defaultStorage.getItem(key)
    return data
  } catch {
    return null
  }
}

export const getDataFromStorage = (key: string) => {
  try {
    const data = defaultStorage.getItem(key)
    if (data !== null && data !== undefined) {
      return JSON.parse(data);
    }
  } catch {
    return null
  }
}
