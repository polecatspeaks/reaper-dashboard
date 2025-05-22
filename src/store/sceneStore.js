import create from 'zustand';

const useSceneStore = create((set) => ({
  scenes: [
    {
      id: 1,
      title: 'Arrival at Kalaman',
      description: 'The party arrives at the war-torn town of Kalaman.',
      npcs: [
        { name: 'Darrett Highwater', description: 'Kalaman officer and contact for the party.' },
        { name: 'Kalaman Officers', description: 'Local military personnel defending Kalaman.' },
      ],
    },
    {
      id: 2,
      title: 'Wheelwatch Outpost',
      description: 'Explore the abandoned Wheelwatch Outpost.',
      npcs: [
        { name: 'Scout Captain', description: 'Leader of the Red Dragon scouts in the area.' },
        { name: 'Red Dragon Soldiers', description: 'Soldiers loyal to the Red Dragon Army.' },
      ],
    },
  ],
  activeSceneId: 1,

  setActiveScene: (id) => set({ activeSceneId: id }),

  updateSceneDescription: (id, description) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id ? { ...scene, description } : scene
      ),
    })),
}));

export default useSceneStore;
