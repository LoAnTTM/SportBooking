import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (key: string): Promise<string> => {
  let value: string = '';
  try {
    value = (await AsyncStorage.getItem(key)) || '';
  } catch (error) {
    console.error(error);
  }
  return value;
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
