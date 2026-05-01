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
    site_2: { ...defaultSiteSettings, name: "Taja Shutki Official" },
  },
  currentSiteId: 'site_2'
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
    updateSiteSettings: (state, action) => {
      const { siteId, settings } = action.payload;
      state.sites[siteId] = { ...state.sites[siteId], ...settings };
      localStorage.setItem('acharu-multi-settings', JSON.stringify(state));
    }
  }
});

export const { setCurrentSite, updateSiteSettings } = settingsSlice.actions;

export const selectCurrentSiteId = (state) => state.settings.currentSiteId;
export const selectCurrentSiteSettings = (state) => 
  state.settings.sites[state.settings.currentSiteId];
export const selectAllSites = (state) => state.settings.sites;

// Legacy selectors
export const selectHeroSlides = (state) => state.settings.sites[state.settings.currentSiteId].hero;
export const selectContact = (state) => state.settings.sites[state.settings.currentSiteId].contact;
export const selectDeliverySettings = (state) => state.settings.sites[state.settings.currentSiteId].delivery;

export default settingsSlice.reducer;
