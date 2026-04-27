# Vault Maintenance Guide — Aziz Rahimov Blog

Instructions for future Claude sessions when the user drops a new Telegram post in. All content in this vault is in **Uzbek** — write new/updated content in Uzbek too, matching the tone and vocabulary of existing notes.

## The vault in 30 seconds

- Obsidian vault archiving the `@azizrakhimov_blog` Telegram channel (2020 → present).
- 17 topical subfolders numbered `00 - …` through `16 - …`. See `README.md` for the folder legend.
- `Aziz Rahimov Blog - MOC.md` at the root is the Map of Content — the entry point for every note.
- Posts in-text are cited as `(Post N)` where `N` is the Telegram message ID (e.g. `Post 786`). The PDF `posts_export.pdf` holds the original archive up to the export date noted in the MOC.
- Linking uses Obsidian `[[Wikilinks]]`. Note filenames are Title Case, Uzbek spelling with `'` (e.g. `O'z-o'zini Rivojlantirish Usullari.md`).

## Workflow: adding a new post

Follow these steps in order. Don't skip the analysis step — mis-filing fragments knowledge across unrelated notes.

### 1. Read the post carefully

- Identify the **core thesis** (one sentence).
- List **named concepts** (e.g. "reja-fakt", "21 kunlik qoida"), **people cited** (Seneka, Hazrati Umar, etc.), and **external links** (`t.me/...`, books, apps).
- Note the **post date** (the user usually says when it was posted; fall back to today's date from context). Convert relative dates to absolute (`2026-04-19`).
- If the post has a visible number (e.g. from Telegram URL `t.me/azizrakhimov_blog/NNN`), record it as `Post N`. If not, use the date instead — do NOT invent a number.

### 2. Decide where it fits

Use this decision tree:

1. **New self-contained concept with a name?** → create a new note in `14 - Tushunchalar/` (e.g. `Reja-Fakt Usuli.md`). Examples already there: `Intizom`, `Rezistans`, `Motivatsiya`, `Kundalik Yozish`.
2. **Extends an existing concept?** → add a dated section to that note. Section heading format: `## <Subtopic> (Post N)` or `## <Subtopic> (YYYY-yil D-MMMM)`.
3. **Just a practical tip/technique?** → append a bullet to `15 - Resurslar/Samaradorlik Texnikalari.md` (or the appropriate Resurslar list), citing the post.
4. **Timeline-worthy only?** → add a bullet to the matching `16 - Xronologiya/…` note and nothing else.

Most posts touch **several** of the above. That's expected — create/extend the canonical home (1 or 2), then cross-link from every other relevant note.

### 3. Write the note (Uzbek, matching existing voice)

Template for a new concept note in `14 - Tushunchalar/`:

```markdown
---
tags:
  - <pick from: amaliy, rivojlanish, tafakkur, islom, xronologiya — match siblings>
---

# <Concept Name in Title Case>

<One-paragraph intro: what the concept is, the post that introduced it with date/post number, Aziz aka's framing.>

## <First subsection — the core idea>

## <Second subsection — how to apply / why it works>

## Amaliy Boshlash  (optional)

---

Bog'liq: [[Related Note 1]] | [[Related Note 2]] | ... | [[Aziz Rahimov Blog - MOC]]
```

Voice cues from existing notes:
- Refer to the author as "Aziz aka" (not "Aziz Rahimov" in body text — that form only appears in headers/bios).
- Cite posts inline: `(Post 786)` or `(2026-yil 16-aprel posti)`.
- For Islamic figures use honorifics: `Hazrati Umar (r.a)`, never bare names.
- External links in Markdown: `[manba: t.me/paramdata/215](https://t.me/paramdata/215)`.

### 4. Wire up links (this is the step people forget)

For every new note and every material edit, update **all** of these that apply:

- [ ] `Aziz Rahimov Blog - MOC.md` — add the new note under the right section (Asosiy / Mavzular / Tushunchalar / Resurslar / Xronologiya).
- [ ] The **topic hub** note (e.g. `04 - Vaqt Boshqaruvi/Vaqt Boshqaruvi.md`, `01 - Shaxsiy Rivojlanish/Shaxsiy Rivojlanish.md`) — add the new note to its "Ichki bo'limlar" or "Bog'liq mavzular" list.
- [ ] Every **existing note the post meaningfully extends** — add either a new section or at minimum a one-line cross-link in the `Bog'liq:` / `Havolalar:` / `Aloqador:` footer. Be thorough: if the post mentions Seneca + journaling + Islamic self-accountability + time management, all four homes get a link.
- [ ] The relevant **chronology note** in `16 - Xronologiya/` — add a dated bullet.
- [ ] New note's own footer — link back to every note it borrows from, and always end with `[[Aziz Rahimov Blog - MOC]]`.

### 5. Sanity-check before finishing

Run these greps to catch common mistakes:

```bash
# New note is reachable from MOC
grep -n "New Note Title" "Aziz Rahimov Blog - MOC.md"

# No orphan wikilinks (targets that don't exist)
grep -rhoE "\[\[[^]]+\]\]" . --include="*.md" | sort -u
# Then spot-check any unfamiliar targets against: find . -name "*.md"

# Post number consistency — no duplicates-with-different-summaries
grep -rn "Post <N>" .
```

If the post introduces a new person/book/app that isn't in the vault yet, mention it inline where it comes up — don't create standalone notes for single mentions. Wait until a concept recurs across ≥2 posts before promoting it to its own note.

## What NOT to do

- Don't translate Uzbek content to English, or vice versa. The vault's language is Uzbek.
- Don't reorganize folders or rename existing notes — wikilinks will break. If a rename is genuinely needed, update every backlink in the same commit.
- Don't add a CSS/theme change, plugin, or `.obsidian/` tweak just because you made a content edit.
- Don't invent post numbers. Missing number → use the date.
- Don't add emojis. Existing notes have none.
- Don't create a new concept note for a single throwaway mention — wait for the concept to recur.

## Git commit convention

Recent commits use short, imperative, lowercase-after-first-word English summaries:
- `Translate English content to Uzbek and reorganize into topical folders`
- `Fix 5 orphan wikilinks in Xronologiya notes`
- `Refactor the reference tone of Aziz aka in some of the files`

For a new-post update, something like:
`Add <Concept Name> note for <date> post and cross-link related notes`

Commit only when the user asks.

## Quick reference: canonical cross-link targets

Most new posts will touch one of these hubs — know them by heart:

- Time/productivity: `[[Vaqt Boshqaruvi]]`, `[[Samaradorlik Texnikalari]]`, `[[Vaqtingning Qiymati]]`
- Journaling/self-review: `[[Kundalik Yozish]]`, `[[Reja-Fakt Usuli]]`
- Discipline/habits: `[[Intizom]]`, `[[Motivatsiya]]`, `[[Rezistans]]`
- Islamic values: `[[Islomiy Qadriyatlar]]` (hub) → `[[Namoz va Ibodat]]`, `[[Ehson va Sadaqa]]`, `[[Sabr Tawakkul va Bayramlar]]`
- Business/career: `[[Biznes va Tadbirkorlik]]`, `[[Biznesni Boshlash]]`, `[[Karera va Ish]]`
- Family/marriage: `[[Oila va Nikoh]]`, `[[Qizni Tanlash Mezonlari]]`, `[[Yigitni Tanlash va Er-Xotin]]`
- Books/reading: `[[Kitob Tavsiyanomalar]]`, `[[Kitob O'qish Falsafasi]]`
- Tools/apps: `[[Foydali Ilovalar]]`, `[[Amaliy Maslahatlar va Vositalar]]`
- Timeline: pick the right `[[Xronologiya YYYY…]]` note in `16 - Xronologiya/`
