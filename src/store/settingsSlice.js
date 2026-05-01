import { createSlice } from '@reduxjs/toolkit';

const defaultSiteSettings = {
  hero: [
    {
      id: 1,
      title: "Premium Churi Shutki",
      subtitle: "Authentic sun-dried Ribbon fish from the coasts of Cox's Bazar.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1600&auto=format&fit=crop",
      productId: "1",
      price: 350,
      badge: "Ocean Fresh"
    }
  ],
  contact: {
    phone: "+880 1234-567890",
    email: "hello@tajashutki.com",
    address: "Marine Drive, Cox's Bazar, Bangladesh"
  },
  delivery: {
    insideCity: 60,
    outsideCity: 110,
    weightCharge: 15
  }
};

const initialState = {
  sites: {
    site_2: { ...defaultSiteSettings, name: "Taja Shutki", categories: [], hero: [] }
  },
  currentSiteId: 'site_2',
  loading: false
};

const loadSettings = () => {
  const saved = localStorage.getItem('acharu-multi-settings');
  return saved ? JSON.parse(saved) : initialState;
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettings(),
  reducers: {
    setCurrentSite: (state, action) => {
      state.currentSiteId = action.payload;
    },
    setInitData: (state, action) => {
      const { categories, hero_slides, site } = action.payload;
      state.sites.site_2.categories = categories;
      state.sites.site_2.hero = hero_slides.length > 0 ? hero_slides : defaultSiteSettings.hero;
      state.sites.site_2.name = site.name;
      state.sites.site_2.contact = site.settings || defaultSiteSettings.contact;
    },
    updateSiteSettings: (state, action) => {
      const { siteId, settings } = action.payload;
      state.sites[siteId] = { ...state.sites[siteId], ...settings };
      localStorage.setItem('acharu-multi-settings', JSON.stringify(state));
    }
  }
});

export const { setCurrentSite, updateSiteSettings, setInitData } = settingsSlice.actions;

export const selectCurrentSiteId = (state) => state.settings.currentSiteId;
export const selectCurrentSiteSettings = (state) => 
  state.settings.sites[state.settings.currentSiteId];
export const selectAllSites = (state) => state.settings.sites;

export const selectCategories = (state) => 
  state.settings.sites[state.settings.currentSiteId].categories;

// Legacy selectors
export const selectHeroSlides = (state) => state.settings.sites[state.settings.currentSiteId].hero;
export const selectContact = (state) => state.settings.sites[state.settings.currentSiteId].contact;
export const selectDeliverySettings = (state) => state.settings.sites[state.settings.currentSiteId].delivery;

export default settingsSlice.reducer;
