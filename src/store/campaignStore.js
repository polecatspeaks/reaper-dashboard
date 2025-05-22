import create from 'zustand';

const useCampaignStore = create((set) => ({
  activeChapter: 'Chapter 4: Shadow of War',
  location: 'Kalaman',
  partyLevel: 4,
  plotThreads: [
    { id: 1, text: 'Vogler evacuated', completed: true },
    { id: 2, text: 'Red Dragon Army scouts spotted', completed: false },
    { id: 3, text: 'Retake Wheelwatch Outpost', completed: false },
    { id: 4, text: 'Zanas Sarlamir encountered', completed: false },
  ],
  npcs: ['Darrett Highwater', 'Kalaman Officers', 'Refugee Leaders'],

  togglePlotThread: (id) =>
    set((state) => ({
      plotThreads: state.plotThreads.map((thread) =>
        thread.id === id ? { ...thread, completed: !thread.completed } : thread
      ),
    })),
}));

export default useCampaignStore;
