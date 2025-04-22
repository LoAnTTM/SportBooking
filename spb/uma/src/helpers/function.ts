export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timeout);
  return debounced as T & { cancel: () => void };
}

export function unicodeToASCII(str: string): string {
  const map: { [key: string]: string } = {
    a: 'áàảãạâấầẩẫậăắằẳẵặ',
    e: 'éèẻẽẹêếềểễệ',
    i: 'íìỉĩị',
    o: 'óòỏõọôốồổỗộơớờởỡợ',
    u: 'úùủũụưứừửữự',
    y: 'ýỳỷỹỵ',
    d: 'đ',
  };

  let result = str;

  for (const key in map) {
    const regex = new RegExp(`[${map[key]}]`, 'g');
    result = result.replace(regex, key);
  }

  return result;
}
