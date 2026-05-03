# Sample data

Seed script + 6 sample letters for the demo persona **Elena Garcia** (74, Spanish-speaking, Boston). All names, addresses, case numbers, and dollar amounts are **fictional**.

## Letters

The PNGs live at `sample-letters/` (rendered upstream, not by this script). All addressed to:

> Elena Garcia, 142 Beacon St, Boston, MA 02116

| File | From | What it tests |
|---|---|---|
| `medicaid-renewal.png` | MassHealth | Renewal w/ 14-day deadline; income-verification ask (Case # MH-2026-0481) |
| `uscis-notice.png` | USCIS (DHS) | I-797 biometrics appointment in 21 days (Receipt # MSC2390581234) |
| `irs-cp14.png` | IRS | CP14 balance due $487.32 in 21 days |
| `hospital-bill.png` | Mass General | Patient responsibility $1,247.50, 30-day terms |
| `bank-notice.png` | Bank of America | Account-closure notice (60 days) for inactive account ending 4421 |
| `social-security.png` | SSA | 2027 COLA — informational, no action required |

Category mix per the demo plan: government (3 — IRS, USCIS, SSA), health (1 — Mass General), financial (2 — MassHealth renewal, BofA closure).

## How to run

In one terminal:

```bash
npm run dev
```

In another, from the repo root:

```bash
npx tsx sample-data/seed.mts
```

The script:

1. POSTs Elena's profile to `/api/users`, captures `user_id`.
2. Base64-encodes each PNG and POSTs to `/api/process-letter` with `{ user_id, image_base64, language: "Spanish" }`.
3. Logs per-letter progress; continues on errors.
4. Prints the final `user_id` and success count.

Override the dev URL with `CLARA_BASE_URL=http://… npx tsx sample-data/seed.mts`.

## Requires

The script depends on `/api/users` and `/api/process-letter` existing — those routes are owned by the backend agent. Until they ship, the script will exit with a clear error.
