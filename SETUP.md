# Sonal's site — setup

Built on [al-folio](https://github.com/alshedivat/al-folio). Content lives in:

| What | File |
|---|---|
| Bio, subtitle, photo settings | `_pages/about.md` |
| Photo | replace `assets/img/prof_pic.jpg` (keep the name) |
| News items on the home page | `_news/*.md` |
| Research page (current work + theses) | `_pages/publications.md`, `_bibliography/papers.bib` |
| Project cards | `_projects/*.md` (add `img: assets/img/<file>` to show a thumbnail) |
| CV page | `_data/cv.yml`; PDF at `assets/pdf/Sonal_Bhatia_CV.pdf` |
| Social links | `_data/socials.yml` |
| Site name, URL, theme options | `_config.yml` |

## Deploy to GitHub Pages

1. Create a public repo named **`s-bhatia1216.github.io`** and push this folder to `main`.
2. Repo → Settings → Actions → General → Workflow permissions → **Read and write**.
3. Wait for the "Deploy site" action to finish; it creates a `gh-pages` branch.
4. Settings → Pages → Source: **Deploy from a branch**, branch **`gh-pages`**, `/ (root)`.
5. Site goes live at https://s-bhatia1216.github.io

Using a different repo name (e.g. `website`)? Set `baseurl: /website` in `_config.yml`.

## Local preview

```bash
docker compose up    # then open http://localhost:8080
```
or `bundle install && bundle exec jekyll serve` with Ruby installed.
