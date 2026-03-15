# Daily Contract Tracker (Static)

Very simple static tracker for one daily contract with checkboxes, a kill list, and previous-day links.

## What it does

- Light password gate in the browser (client-side hash check).
- Displays one `Current Pull`, `Allowed Switches`, `Parking Lot`, and `🔪🪦 Just Killed`.
- Shows previous-day contract links from `history.json`.
- Saves checkbox state in browser `localStorage` per day (`date` key in `contract.json`).

## Security note

This is nominal privacy only. Because it is static client code, the hash and page source are visible to anyone who knows the URL.

## Setup

1. Set your local password field in [`/Users/kamran/Documents/projects_master/klh_ganizer/.env.daily-contract`](/Users/kamran/Documents/projects_master/klh_ganizer/.env.daily-contract):

`DAILY_CONTRACT_PASSWORD=your-password-here`

2. Imprint the hash into [`script.js`](./script.js):

```bash
web/daily-contract/set-password-hash.sh
```

3. Edit [`contract.json`](./contract.json) daily (or whenever your contract changes).
4. Add prior contracts as JSON files under `contracts/` and list them in [`history.json`](./history.json).

5. Publish this folder under an unlinked path in your GitHub Pages repo, for example:

- `https://kamranhakiman.com/private/daily-contract/`

6. Do not link this page from nav/sitemap if you want it low-visibility.

## Files

- `index.html`: UI
- `styles.css`: styling
- `script.js`: password gate + checklist logic
- `set-password-hash.sh`: reads `.env.daily-contract` and updates password hash
- `contract.json`: current daily contract data
- `history.json`: linked daily archive index
- `contracts/*.json`: prior daily contracts
