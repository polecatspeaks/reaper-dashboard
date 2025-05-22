# REAPER — RPG Encounter and Adventure Preparedness Engine for Roleplaying

![REAPER Logo](./assets/reaper-logo.svg)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub issues](https://img.shields.io/github/issues/polecatspeaks/reaper-dashboard)](https://github.com/polecatspeaks/reaper-dashboard/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/polecatspeaks/reaper-dashboard)](https://github.com/polecatspeaks/reaper-dashboard/pulls)
[![GitHub stars](https://img.shields.io/github/stars/polecatspeaks/reaper-dashboard?style=social)](https://github.com/polecatspeaks/reaper-dashboard/stargazers)

---

## Overview

**REAPER** is a powerful and flexible web-based GM toolset designed to streamline
your tabletop RPG campaigns. It helps Dungeon Masters and game masters effortlessly
manage player characters, narrative scenes, combat encounters, and DM notes — all in
one place. Built with React, Zustand, and a Node.js backend, REAPER brings modern
convenience to classic pen-and-paper adventures.

---

## Features

- **Campaign Dashboard:** Track player characters, NPCs, stats, and hit points with
  easy-to-read interfaces.  
- **Scene Manager:** Organize scenes, assign maps extracted directly from your
  campaign PDFs, and keep DM notes tied to narrative moments.  
- **Combat Tracker:** Manage initiative, conditions, and combat notes for dynamic
  battle management.  
- **DM Module:** Centralize campaign and scene notes, upload chapter PDFs for map
  extraction, and export your session data as JSON backups.  
- **Map Extraction:** Upload your official PDFs, automatically extract maps, and
  assign them to scenes for quick reference.  
- **Persistence:** All your data is saved locally for session continuity, with plans
  to extend cloud sync.  

---
## Getting Started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- Poppler-utils (`pdfimages`, `pdftotext`) installed and available  
  in your PATH for map extraction  
- GitHub CLI (optional, for repo management)  

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/polecatspeaks/reaper-dashboard.git
   cd reaper-dashboard
2. Install dependencies:

```bash
npm install
Start the backend server (map extraction API):

```bash
cd backend
node server.js
Start the frontend app:

```bash
cd ..
npm start
Open http://localhost:3000 in your browser.

## Usage

- Use the **DM Module** to upload campaign PDFs and extract maps automatically.  
- Navigate to the **Scene Manager** to organize narrative scenes, assign maps, and manage NPCs.  
- Track combat with the **Combat Tracker**, including initiative and conditions.  
- Export your session data to JSON for backup or sharing.

---

## Contributing

Contributions are very welcome! Please fork the repo, make your changes on a feature branch,  
and submit a pull request. Be sure to follow the existing code style and include  
meaningful commit messages.

---

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by classic tabletop RPG tools and modern web frameworks.  
- Thanks to the open-source community for React, Zustand, Node.js, Poppler, and many others.  
- Special shoutout to the doggos Clara and Ranger for moral support during development. 🐾🐕

---

## Contact

Christopher Mann — [GitHub](https://github.com/polecatspeaks) — [Email](mailto:mannchristophers@gmail.com)  

---

*Ready to bring your campaigns to life? REAPER awaits.*  

