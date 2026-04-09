export const cookieProvider = {
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return decodeURIComponent(match[2]);
    }
    return null;
  },
  set: (name: string, value: string, days = 7, path = '/'): void => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
  },
  remove: (name: string, path = '/'): void => {
    if (typeof document === "undefined") return;
    document.cookie = name + '=; Max-Age=-99999999; path=' + path;
  }
};
