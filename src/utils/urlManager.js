// src/utils/urlManager.js
const urlManager = {
  urls: new Map(),

  // Get or create a blob URL for a file
  getUrl(file) {
    // Use the file object itself as a key
    if (!this.urls.has(file)) {
      const url = URL.createObjectURL(file);
      this.urls.set(file, url);
    }
    return this.urls.get(file);
  },

  // Revoke a specific URL
  revokeUrl(file) {
    if (this.urls.has(file)) {
      URL.revokeObjectURL(this.urls.get(file));
      this.urls.delete(file);
    }
  },

  // Revoke all URLs
  revokeAll() {
    this.urls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.urls.clear();
  },
};

export default urlManager;
