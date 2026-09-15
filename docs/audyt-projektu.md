# Audyt projektu — Księże, katalog usług i sklepów

Data audytu: 2026-09-15
Zakres: cały przebieg prac od inicjalizacji projektu do bieżącego stanu na branchu `main`.

## 1. Efekt prac

### Co powstało

Statyczna strona Astro (TypeScript, strict) — katalog usług, sklepów i instytucji na
wrocławskim osiedlu Księże, zgodny z briefem w [`CLAUDE.md`](../CLAUDE.md).

| Element | Stan |
|---|---|
| Wpisy w katalogu (`places.yaml`) | 64 |
| Kategorie (`categories.yaml`) | 14 |
| Ważne telefony (`emergency.yaml`) | 6 (w tym 1 z dwoma numerami: stacjonarny + kom.) |
| Wygenerowane strony (`astro build`) | 17 (strona główna, 14× kategoria, ważne telefony, 404) |
| Linie kodu źródłowego (`src/**/*.astro`, `*.ts`) | 837 |
| Rozmiar builda produkcyjnego (`dist/`) | 266 KB |
| Commity na `main` | 7 |
| Śledzone pliki w repo | 35 |

### Funkcje zrealizowane (zgodnie z sekcją 3 briefu)

- Wyszukiwarka (nazwa, opis, tagi, adres) tolerująca brak polskich znaków (np. „ksiezeca” → „Księżęca”).
- Filtry: kategoria + lokalizacja (🏠 Na Księżu / 📍 W pobliżu / 🚐 Z dojazdem).
- Karta wpisu: adres → link do Google Maps (nowa karta), telefon jako `tel:`, strona www, tagi, etykieta „do weryfikacji”.
- Podstrony kategorii z podziałem na sekcje lokalizacji; puste kategorie pokazują zachętę „Zgłoś!”.
- Osobna zakładka „Ważne telefony” + link w nawigacji.
- Przycisk „Zgłoś miejsce / popraw dane” — prowadzi do formularza Google Forms, z automatycznym fallbackiem na link do grupy FB, gdy formularz nie jest ustawiony.
- Stopka: informacja o nieodpłatnym charakterze listy, link do grupy FB, data ostatniej aktualizacji.
- Strona działa w pełni bez JS (cała lista renderowana server-side); JS dogrywa tylko filtrowanie.
- Tryb jasny/ciemny (`prefers-color-scheme`, zmienne CSS).
- Baner „strona w wersji testowej” na wszystkich podstronach (dodany na życzenie, tymczasowy).

### Jakość i bezpieczeństwo — zweryfikowane

- **Walidacja danych**: schemat Zod w [`content.config.ts`](../src/content.config.ts) — celowo wprowadzony błędny wpis (nieistniejąca kategoria) przerwał build z czytelnym komunikatem wskazującym plik i pole; test wykonany i cofnięty.
- **Lighthouse (mobile)**: strona główna i podstrona kategorii „Zdrowie” (najbardziej obciążona, 11 wpisów) — **100/100** w Performance, Accessibility, Best Practices i SEO.
- **`npm audit`**: 0 podatności w 286 pakietach zależności.
- **Przegląd kodu pod XSS/iniekcje**: brak `set:html`, `innerHTML`, `eval()`; wszystkie dynamiczne wartości przechodzą przez auto-escaping Astro; skrypt wyszukiwarki nigdy nie wstawia tekstu użytkownika do DOM jako HTML.
- **Linki zewnętrzne**: każdy `target="_blank"` ma `rel="noopener noreferrer"` (brak podatności reverse-tabnabbing).
- **Nagłówki bezpieczeństwa** (`public/_headers`, aktywne na produkcji, zweryfikowane przez `curl`): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Weryfikacja danych faktograficznych**: 5 wpisów oznaczonych `needs_verification` sprawdzonych w sieci i/lub potwierdzonych przez moderatora (Sklep Rabat/ABC, Rada Osiedla Księże, Piekarnia Hert, Panaceum) — żaden wpis nie nosi już tej flagi.

### Wdrożenie

- **Repozytorium**: [github.com/KubsonPL/ksieze-strona](https://github.com/KubsonPL/ksieze-strona) — publiczne, branch `main`.
- **Hosting**: Cloudflare Workers (Static Assets, bez kodu Workera — `assets`-only), podłączony przez natywną integrację Git w dashboardzie Cloudflare (bez kluczy API po stronie repozytorium).
- **Adres produkcyjny**: [ksieze-strona.karolak-jakubb.workers.dev](https://ksieze-strona.karolak-jakubb.workers.dev)
- **Automatyzacja**: każdy `push` na `main` uruchamia automatyczny build (`npm run build`) i publikację nowej wersji — bez GitHub Actions, bez ręcznego `wrangler deploy`.
- **Formularz zgłoszeń**: Google Forms, założony i utrzymywany przez moderatora, link podpięty w `src/config.ts`.

## 2. Chronologia prac (commity na `main`)

| Data / godzina | Commit | Opis |
|---|---|---|
| 2026-09-15 21:03 | `3b3acab` | Szkielet MVP: Astro + Content Collections, dane startowe, wyszukiwarka i filtry, strony kategorii, konfiguracja Cloudflare Workers |
| 2026-09-15 21:17 | `c552330` | Link do grupy FB Księżanie |
| 2026-09-15 22:30 | `b13faaf` | Link do formularza zgłoszeń Google Forms |
| 2026-09-15 22:41 | `3ca7f7e` | Weryfikacja wpisów `needs_verification` (Rabat/ABC, Rada Osiedla) |
| 2026-09-15 22:47 | `6659b60` | Uzupełnienie weryfikacji: adres Piekarni Hert, telefon Panaceum |
| 2026-09-15 23:05 | `2b0292f` | Nagłówki bezpieczeństwa (`_headers`) + baner wersji testowej |
| 2026-09-15 23:15 | `2688032` | Ważne telefony bez `+48`, dane dzielnicowego i awarii wodociągowych |

Cała praca deweloperska (od pierwszego do ostatniego commita) zamknęła się w ok. **2 godzinach 15 minutach**
w obrębie jednej sesji roboczej z asystentem AI (Claude Code); faza planowania i budowy szkieletu przed
pierwszym commitem trwała dodatkowo ok. 1–1,5 godziny.

## 3. Koszt wykonania zadania

- **Narzędzie**: Claude Code w ramach subskrypcji Claude Pro — opłata stała (flat-rate), nie rozliczana
  per zadanie/token, więc to zadanie nie generowało dodatkowego kosztu pieniężnego ponad już opłacony plan.
- **Zużycie w ramach planu** (stan na koniec sesji): ok. **76%** 5-godzinnego limitu sesji Claude Pro,
  ok. **14%** limitu tygodniowego. Kontekst tej rozmowy: **~307 tys. / 1 mln tokenów** (31%).
- **Koszty infrastruktury**: **0 zł** — Cloudflare Workers (plan darmowy, statyczne assety bez limitu
  requestów), GitHub (repo publiczne, bezpłatne), Google Forms (bezpłatne). Zgodnie z założeniem
  z briefu („strona jest darmowa w utrzymaniu”) — spełnione.
- **Koszt czasu człowieka**: kilkanaście decyzji/potwierdzeń (styl, hosting, widoczność repo, logowania
  do GitHub/Cloudflare/Google) — reszta prac wykonana automatycznie przez asystenta.

## 4. Co zostało zainstalowane / usunięte / co pozostało

### W projekcie (`package.json`, pod kontrolą gita)

| Pakiet | Status |
|---|---|
| `astro@7.3.2` | zainstalowany, jedyna zależność produkcyjna |
| `yaml` | **zainstalowany, a następnie odinstalowany** — Astro Content Layer ma wbudowaną obsługę YAML w loaderze `file()`, dodatkowy parser okazał się zbędny |

`node_modules/` (141 MB) — obecne lokalnie, objęte `.gitignore`, nie trafiają do repozytorium.

### Na maszynie lokalnej (poza projektem)

| Narzędzie | Status | Uwagi |
|---|---|---|
| GitHub CLI (`gh`) v2.101.0 | **zainstalowany globalnie** (przez `winget`) i pozostaje | Zalogowany jako `KubsonPL`, token OAuth przechowywany w Windows Credential Manager (uprawnienia: `gist`, `read:org`, `repo`) |
| `npx` cache (`create-astro`, `lighthouse`) | pozostał w cache npm | ~174 MB w `%LOCALAPPDATA%\npm-cache\_npx` — tymczasowe pobrania, nie są częścią projektu; można wyczyścić `npx clear-npx-cache`, jeśli zależy na miejscu na dysku |
| Wrangler CLI | **nie instalowany** | Deploy idzie przez natywną integrację Git w dashboardzie Cloudflare, nie przez lokalny `wrangler deploy` |

### Zasoby zdalne utworzone (poza maszyną lokalną)

| Zasób | Status |
|---|---|
| Repozytorium GitHub `KubsonPL/ksieze-strona` | utworzone, publiczne |
| Cloudflare Worker `ksieze-strona` | utworzony, plan darmowy, podłączony do repo |
| Formularz Google Forms | utworzony przez moderatora, link podpięty w konfiguracji |

### Nic nie zostało usunięte z systemu użytkownika

Jedyne „odinstalowanie” w całym procesie to pakiet `yaml` w obrębie samego projektu (patrz wyżej) —
nie ruszano żadnych innych zasobów (w tym istniejącej domeny `smartkarolakowo.pl` i tuneli Cloudflare
używanych do Home Assistant, zgodnie z wcześniejszym zastrzeżeniem).

## 5. Otwarte kwestie / możliwe następne kroki

Zgodnie z sekcją 4 briefu („funkcje na później”) — świadomie **nie** zrealizowane w MVP:

- Mapa wszystkich miejsc (Leaflet + OpenStreetMap) — wymaga dodania współrzędnych do danych.
- Godziny otwarcia z oznaczeniem „otwarte teraz”.
- Panel edycji dla moderatora (np. Decap CMS) zamiast ręcznej edycji YAML.
- Eksport listy do posta na Facebooka.

Dodatkowo:

- Własna domena — na razie strona działa pod darmowym `*.workers.dev`; podpięcie domeny to jednorazowa
  zmiana w Cloudflare (Settings → Domains & Routes), opisana jako krok „na później” w README.
- Baner „wersja testowa” jest tymczasowy — do usunięcia (`src/layouts/Base.astro`), gdy strona przejdzie
  do normalnej eksploatacji.
- Token OAuth GitHub CLI na tej maszynie ma szeroki zakres (`repo`) — jeśli maszyna jest współdzielona,
  warto rozważyć `gh auth logout`, gdy narzędzie nie jest już potrzebne.
