import create from 'zustand';

const useCombatStore = create((set) => ({
  combatants: [
    {
      id: 1,
      name: 'Ollie McKenzie',
      type: 'Player',
      hp: 30,
      maxHp: 30,
      initiative: 15,
      conditions: [],
      description: 'A pragmatic mechwarrior with a hereditary Hunchback 4P.',
    },
    {
      id: 2,
      name: 'Goblin Scout',
      type: 'Enemy',
      hp: 12,
      maxHp: 12,
      initiative: 12,
      conditions: [],
      description: 'Quick and sneaky goblin scout, uses hit-and-run tactics.',
    },
    {
      id: 3,
      name: 'Red Dragon Soldier',
      type: 'Enemy',
      hp: 18,
      maxHp: 18,
      initiative: 10,
      conditions: [],
      description: 'Disciplined soldier of the Red Dragon Army, trained in melee combat.',
    },
  ],
  activeTurnId: 1,

  setActiveTurn: (id) => set({ activeTurnId: id }),

  updateHp: (id, hp) =>
    set((state) => ({
      combatants: state.combatants.map((c) =>
        c.id === id ? { ...c, hp: Math.min(Math.max(hp, 0), c.maxHp) } : c
      ),
    })),

  toggleCondition: (id, condition) =>
    set((state) => ({
      combatants: state.combatants.map((c) => {
        if (c.id !== id) return c;
        const hasCondition = c.conditions.includes(condition);
        return {
          ...c,
          conditions: hasCondition
            ? c.conditions.filter((cond) => cond !== condition)
            : [...c.conditions, condition],
        };
      }),
    })),

  nextTurn: () =>
    set((state) => {
      if (state.combatants.length === 0) return {};
      const currentIndex = state.combatants.findIndex((c) => c.id === state.activeTurnId);
      const nextIndex = (currentIndex + 1) % state.combatants.length;
      return { activeTurnId: state.combatants[nextIndex].id };
    }),
}));

export default useCombatStore;
