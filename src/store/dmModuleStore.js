import create from 'zustand';

const STORAGE_KEY = 'reaper_dmModule';

const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch {
    return null;
  }
};

const initialState = loadState() || {
  campaignNotes: '',
  sceneNotes: {},
  combatNotes: {},
  chapterInfo: {
    title: 'Chapter 4: The War-torn Town of Kalaman',
    summary: `The adventurers arrive at Kalaman, a town ravaged by conflict. The party must navigate
alliances, scout enemy movements, and prepare for the looming battle ahead.`,
    flavorText: `“In the smoke-filled streets, every shadow hides a secret, and every ally might be a foe.”`,
  },
  sceneMapAssignments: {},
};

const useDmModuleStore = create((set, get) => ({
  ...initialState,

  setCampaignNotes: (notes) => {
    set({ campaignNotes: notes });
    saveState({ ...get(), campaignNotes: notes });
  },

  setSceneNotes: (sceneId, notes) => {
    const newSceneNotes = { ...get().sceneNotes, [sceneId]: notes };
    set({ sceneNotes: newSceneNotes });
    saveState({ ...get(), sceneNotes: newSceneNotes });
  },

  setCombatNotes: (combatId, notes) => {
    const newCombatNotes = { ...get().combatNotes, [combatId]: notes };
    set({ combatNotes: newCombatNotes });
    saveState({ ...get(), combatNotes: newCombatNotes });
  },

  setChapterInfo: (chapterInfo) => {
    set({ chapterInfo });
    saveState({ ...get(), chapterInfo });
  },

  setSceneMapAssignments: (assignments) => {
    set({ sceneMapAssignments: assignments });
    saveState({ ...get(), sceneMapAssignments: assignments });
  },

  // Remove/unassign map from scene
  removeMapFromScene: (sceneId) => {
    const newAssignments = { ...get().sceneMapAssignments };
    delete newAssignments[sceneId];
    set({ sceneMapAssignments: newAssignments });
    saveState({ ...get(), sceneMapAssignments: newAssignments });
  },
}));

function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore write errors
  }
}

export default useDmModuleStore;
