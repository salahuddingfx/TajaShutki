import { createSlice } from '@reduxjs/toolkit';

const defaultSiteSettings = {
  hero: [
    {
      id: 1,
      title: "Authentic Sun-Dried Seafood",
      subtitle: "Traditional taste from the coast of Cox's Bazar.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1600&auto=format&fit=crop",
      productId: "1",
      price: 450,
      badge: "100% Naturally Dried"
    }
  ],
  contact: {
    phone: "+880 1234-567890",
    email: "hello@tajashutki.com",
    address: "Marine Drive, Cox's Bazar, Bangladesh"
  },
  delivery: {
    insideCity: 70,
    outsideCity: 120,
    weightCharge: 20
  }
};

const initialState = {
  sites: {
    site_1: { ...defaultSiteSettings, name: "Acharu", categories: [], hero: [] },
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
      const siteKey = site.id === 1 ? 'site_1' : 'site_2';
      const s = site.settings || {};
      
      state.sites[siteKey].categories = categories;
      state.sites[siteKey].hero = hero_slides.length > 0 ? hero_slides : defaultSiteSettings.hero;
      state.sites[siteKey].name = site.name;
      
      state.sites[siteKey].contact = {
        phone: s.support_phone || s.phone || defaultSiteSettings.contact.phone,
        email: s.store_email || s.email || defaultSiteSettings.contact.email,
        address: s.address || defaultSiteSettings.contact.address,
        whatsapp: s.whatsapp_number || '',
      };

      state.sites[siteKey].delivery = {
        insideCity: Number(s.delivery_inside) || 70,
        outsideCity: Number(s.delivery_outside) || 120,
        weightCharge: Number(s.delivery_per_kg) || 10,
      };

      state.sites[siteKey].about = s.about ? (typeof s.about === 'string' ? JSON.parse(s.about) : s.about) : null;
      state.sites[siteKey].home = s.home ? (typeof s.home === 'string' ? JSON.parse(s.home) : s.home) : null;
      
      state.initData = action.payload;
      // Persist the new state immediately to local storage
      localStorage.setItem('acharu-multi-settings', JSON.stringify(state));
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

export const selectHeroSlides = (state) => state.settings.sites[state.settings.currentSiteId].hero;
export const selectContact = (state) => state.settings.sites[state.settings.currentSiteId].contact;
export const selectDeliverySettings = (state) => state.settings.sites[state.settings.currentSiteId].delivery;
export const selectHomeSettings = (state) => state.settings.sites[state.settings.currentSiteId].home;
export const selectAboutSettings = (state) => state.settings.sites[state.settings.currentSiteId].about;

export default settingsSlice.reducer;
