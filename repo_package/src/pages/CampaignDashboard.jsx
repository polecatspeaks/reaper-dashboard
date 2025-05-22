import React from 'react';

const CampaignDashboard = () => {
  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight">REAPER: Campaign Dashboard</h1>
      <p className="mt-2 text-lg italic">Because death is only the beginning of your session prep.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">📜 Active Chapter</h2>
          <p className="mt-2">Chapter 4: Shadow of War</p>
          <p className="text-sm text-gray-700">Location: Kalaman | Party Level: 4</p>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">🧠 Plot Threads</h2>
          <ul className="mt-2 list-disc list-inside text-sm">
            <li>☑️ Vogler evacuated</li>
            <li>⬜ Red Dragon Army scouts spotted</li>
            <li>⬜ Retake Wheelwatch Outpost</li>
            <li>⬜ Zanas Sarlamir encountered</li>
          </ul>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow md:col-span-2">
          <h2 className="text-2xl font-semibold">🧙 NPCs in Play</h2>
          <p className="mt-2">Darrett Highwater, Kalaman Officers, Refugee Leaders</p>
        </section>
      </div>
    </div>
  );
};

export default CampaignDashboard;
