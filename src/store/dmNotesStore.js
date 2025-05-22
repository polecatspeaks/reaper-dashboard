import create from 'zustand';

const useDmNotesStore = create((set) => ({
  campaignNotes: '',
  sceneNotes: {}, // { [sceneId]: string }

  setCampaignNotes: (notes) => set({ campaignNotes: notes }),
  setSceneNotes: (sceneId, notes) =>
    set((state) => ({
      sceneNotes: {
        ...state.sceneNotes,
        [sceneId]: notes,
      },
    })),
}));

export default useDmNotesStore;
