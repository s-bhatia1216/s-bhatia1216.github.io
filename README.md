# Sonal Bhatia's website

Source for https://s-bhatia1216.github.io, built with Jekyll on the al-folio theme.

The site has two modes:

- **Professional** (the default): the regular al-folio site.
- **Creative**: "Ascent", an interactive view that tells the same story as a launch to orbit. Scrolling is the climb: the sky changes color with altitude, and each section sits at its own height (pad, troposphere, stratosphere, mesosphere, Kármán line, low Earth orbit).

Visitors switch modes with the REMOVE BEFORE FLIGHT tag in the top right corner. To link straight into creative mode (for example from a resume), use:

```
https://s-bhatia1216.github.io/?mode=creative
```

`?mode=professional` forces the professional site. The choice is remembered in the visitor's browser.

## Editing content

Each fact lives in one place. Edit these files and rebuild; never edit layout code to change content.

| What                                                                         | Where                                                 |
| ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| Project titles, blurbs, and full project pages (both modes)                  | `_projects/<name>.md`                                 |
| Updates                                                                      | `_news/`                                              |
| Publications on the professional site                                        | `_bibliography/papers.bib`                            |
| About, resume, research, teaching, CV pages                                  | `_pages/`                                             |
| Everything only creative mode shows                                          | `_data/ascent.yml`                                    |

`_data/ascent.yml` holds, in order:

- `switch`: the two mode labels shown on the tag.
- `intro`: name, one-line intro, and the hero photo (with a fallback).
- `domains`: the seven stars of the star chart. Their order sets their place around the chart (the first one is at the top).
- `sections`: the altitude label and title for each section.
- `projects`: per project (keyed by its file name in `_projects/`), the domains it draws on and its notebook entry: `objective`, `approach`, `result`, and `human` (the "For people" line).
- `pipeline`: the systems and hardware work shown as a 5-stage instruction pipeline.
- `offduty`, `research`, `current`: the Research section. `research` mirrors `papers.bib` by hand, so update both when you add a paper.
- `patches` and `flightlog`: the Crews and patches section. Each patch picks a `motif`: `rocket`, `moon`, `constellation`, or `lamp`.
- `honors`: awards for the star catalog (publications are added from `research`).
- `curiosities`: questions you're chasing.
- `contact`: emails, links, and the resume PDF.

Any value that starts with `TODO` is treated as a placeholder and hidden in creative mode.

Creative mode reads everything through `assets/ascent/content.json`, which Jekyll generates on every build from the files above.

## How creative mode is built

- `_plugins/ascent_switch.rb` adds the switch to every page at build time (the theme's layouts live in a gem, so nothing is overridden). Professional pages load only `switch.js` and `switch.css`, about 3 KB gzipped.
- Everything else in `assets/ascent/` loads only when someone turns creative mode on:
  - `ascent.js` builds the view and handles the crossfade; the professional page underneath is covered, never edited.
  - `sky.js` turns scrolling into sky color, picks ink or starlight text to keep WCAG AA contrast at every altitude, fades in the starfield, and runs the altimeter.
  - `chart.js` draws the star chart; `sections.js` fills the other sections; `lorenz.js`, `patches.js`, `pipeline.js`, and `orbit.js` draw the figures.
- No libraries: plain JavaScript, SVG, and Canvas. Fonts (Bricolage Grotesque, Spectral, Martian Mono, Courier Prime) come from Google Fonts in creative mode only.
- Motion is calm and optional. In creative mode only the star chart twinkles; the Lorenz figure draws once; the pipeline and orbit toy move when you press a button. With reduced motion turned on, nothing animates.

## Running locally

Uses Homebrew Ruby:

```bash
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/bin:$PATH"
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000 (add `?mode=creative` to see creative mode). Restart the server after changing anything in `_plugins/`.

## Deploying

Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site, purges unused CSS, and publishes to the `gh-pages` branch, which GitHub Pages serves. Never force-push `main`.

## Open TODOs

- **Curiosities**: the three entries in `curiosities` are placeholders. The "Questions I'm chasing" list stays hidden until at least one is filled in.
- **"For people" lines**: drafted from the project pages; review the `human` lines in `projects` and on the thesis in `research`.
- **Claims kept out until confirmed**: MATRIX recognition (outstanding leader, oral presenter), NANI's 98% detection and 99% uptime figures, NeuroBoost model details, and the Tumblenauts tumbling-target motion planner. The PINN cyclone work is shown as in progress with no results.
- **Publications**: `research` in `_data/ascent.yml` mirrors `papers.bib` by hand.
- **Lighthouse**: not yet run on creative mode. The Lighthouse CLI needs an Apple Silicon build of Node (`brew install node`), or run it in Chrome DevTools on the live site.
- **Old commits**: earlier commits that contained a phone number are still reachable on GitHub by their hashes.
- **Backup branch**: `backup/creative-v1` holds the earlier creative-mode attempt and can be deleted once you no longer want it.
