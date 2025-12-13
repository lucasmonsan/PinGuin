export interface I18nDictionary {
  search: {
    placeholder: string;
    noResults: string;
    hints: {
      title: string;
      items: string[];
    };
  };
  buttons: {
    clear: string;
    search: string;
    locate: string;
    profile: string;
  };
  errors: {
    searchFailed: string;
    locationDenied: string;
    locationUnavailable: string;
    locationTimeout: string;
  };
  places: {
    [key: string]: string;
  };
}

export type Locale = 'pt-BR' | 'en-US';