// Search history management
const SEARCH_HISTORY_KEY = 'search-history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export const searchHistoryService = {
  // Get search history
  getHistory(): SearchHistoryItem[] {
    try {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  },

  // Add search query to history
  addToHistory(query: string): void {
    if (!query.trim()) return;

    try {
      const history = this.getHistory();
      
      // Remove duplicate if exists
      const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      
      // Add new query at the beginning
      const newHistory: SearchHistoryItem[] = [
        { query: query.trim(), timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to add to search history:', error);
    }
  },

  // Remove item from history
  removeFromHistory(query: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.query !== query);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from search history:', error);
    }
  },

  // Clear all history
  clearHistory(): void {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  },

  // Get recent searches (last N items)
  getRecentSearches(limit: number = 5): string[] {
    return this.getHistory()
      .slice(0, limit)
      .map(item => item.query);
  }
};
