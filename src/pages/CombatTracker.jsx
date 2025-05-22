import React from 'react';
import useCombatStore from '../store/combatStore';
import useDmModuleStore from '../store/dmModuleStore';

const CONDITIONS = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated'];

const CombatTracker = () => {
  const { combatants, activeTurnId, setActiveTurn, updateHp, toggleCondition, nextTurn } = useCombatStore();
  const { combatNotes, setCombatNotes } = useDmModuleStore();

  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
  const activeCombatId = 'default'; // Extend later for actual combat encounter IDs

  const handleCombatNotesChange = (e) => {
    setCombatNotes(activeCombatId, e.target.value);
  };

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">⚔️ Combat Tracker</h1>

      <table className="w-full border border-ink rounded shadow-md bg-white/90">
        <thead>
          <tr className="bg-ink text-parchment">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">HP</th>
            <th className="p-2 text-center">Initiative</th>
            <th className="p-2 text-center">Conditions</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCombatants.map(({ id, name, hp, maxHp, initiative, conditions }) => {
            const isActive = id === activeTurnId;
            return (
              <tr
                key={id}
                className={`${isActive ? 'bg-soul text-white font-semibold' : ''} border-t border-ink`}
                onClick={() => setActiveTurn(id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="p-2">{name}</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={maxHp}
                    value={hp}
                    onChange={(e) => updateHp(id, Number(e.target.value))}
                    className="w-16 text-center border border-gray-400 rounded"
                  />{' '}
                  / {maxHp}
                </td>
                <td className="p-2 text-center">{initiative}</td>
                <td className="p-2 text-center space-x-1">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCondition(id, cond);
                      }}
                      className={`text-xs px-1 rounded border ${
                        conditions.includes(cond)
                          ? 'bg-ink text-parchment border-ink'
                          : 'bg-white text-ink border-gray-400'
                      }`}
                      title={cond}
                      type="button"
                    >
                      {cond[0]}
                    </button>
                  ))}
                </td>
                <td className="p-2 text-center">{isActive ? '👑 Active' : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="mt-6 p-4 border border-ink rounded bg-white/80">
        <h3 className="font-semibold text-xl mb-2">Combat Notes</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
          placeholder="Enter notes for the active combat encounter here..."
          value={combatNotes[activeCombatId] || ''}
          onChange={handleCombatNotesChange}
        />
      </section>

      <button
        onClick={nextTurn}
        className="mt-4 px-4 py-2 bg-ink text-parchment rounded hover:bg-soul transition"
        type="button"
      >
        Next Turn
      </button>
    </div>
  );
};

export default CombatTracker;
