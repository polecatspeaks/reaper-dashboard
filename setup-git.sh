#!/bin/bash
set -e

echo "Fixing README.md logo path and ensuring full content..."

cat > README.md << 'EOF'
# REAPER — RPG Encounter and Adventure Preparedness Engine for Roleplaying

![REAPER Logo](./assets/reaper-logo.png)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub issues](https://img.shields.io/github/issues/polecatspeaks/reaper-dashboard)](https://github.com/polecatspeaks/reaper-dashboard/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/polecatspeaks/reaper-dashboard)](https://github.com/polecatspeaks/reaper-dashboard/pulls)
[![GitHub stars](https://img.shields.io/github/stars/polecatspeaks/reaper-dashboard?style=social)](https://github.com/polecatspeaks/reaper-dashboard/stargazers)

---

## Overview

**REAPER** is a powerful and flexible web-based GM toolset designed to streamline your tabletop RPG campaigns.  
It helps Dungeon Masters and game masters effortlessly manage player characters, narrative scenes, combat encounters, and DM notes — all in one place.  
Built with React, Zustand, and a Node.js backend, REAPER brings modern convenience to classic pen-and-paper adventures.

---

## Features

- **Campaign Dashboard:** Track player characters, NPCs, stats, and hit points with easy-to-read interfaces.  
- **Scene Manager:** Organize scenes, assign maps extracted directly from your campaign PDFs, and keep DM notes tied to narrative moments.  
- **Combat Tracker:** Manage initiative, conditions, and combat notes for dynamic battle management.  
- **DM Module:** Centralize campaign and scene notes, upload chapter PDFs for map extraction, and export your session data as JSON backups.  
- **Map Extraction:** Upload your official PDFs, automatically extract maps, and assign them to scenes for quick reference.  
- **Persistence:** All your data is saved locally for session continuity, with plans to extend cloud sync.  

---

## Getting Started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- Poppler-utils (`pdfimages`, `pdftotext`) installed and available in your PATH for map extraction  
- GitHub CLI (optional, for repo management)  

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/polecatspeaks/reaper-dashboard.git
   cd reaper-dashboard

