# Księże – katalog usług i sklepów

Strona internetowa z listą usług, sklepów i instytucji na osiedlu Księże we Wrocławiu.
Ten plik jest instrukcją dla moderatora — osoby, która **nie musi umieć programować**,
ale będzie dodawać i poprawiać wpisy.

## 1. Gdzie są dane

Wszystkie wpisy znajdują się w trzech plikach w katalogu `src/data/`:

- `places.yaml` — sklepy, usługi, instytucje (główna lista),
- `categories.yaml` — lista kategorii (np. „Zwierzęta”, „Zdrowie”),
- `emergency.yaml` — ważne telefony (numer alarmowy, pogotowia itd.).

Pliki edytuje się bezpośrednio na GitHubie, w przeglądarce — **nie potrzeba żadnego
programu instalować na komputerze**.

## 2. Jak dodać nowy wpis

1. Wejdź na stronę repozytorium na GitHubie i otwórz plik `src/data/places.yaml`.
2. Kliknij ikonę ołówka (✏️ „Edit this file”) w prawym górnym rogu pliku.
3. Skopiuj jeden istniejący wpis (blok zaczynający się od `- id:` do pustej linii przed
   następnym wpisem) i wklej go na końcu odpowiedniej sekcji (np. `# ===== SKLEPY =====`).
4. Zmień wartości pól:

   ```yaml
   - id: nazwa-w-formie-slug        # unikalne, tylko małe litery i myślniki, bez spacji
     name: Nazwa firmy
     category: shops                 # slug kategorii, patrz punkt 4 poniżej
     location: ksieze                 # ksieze | nearby | mobile
     address: Ulica 12                # opcjonalne — zostaw pole, jeśli nie znasz adresu, usuń całą linię
     phone: "+48 123 456 789"         # opcjonalne, ZAWSZE w cudzysłowie
     website: ""                      # opcjonalne
     description: Krótki opis
     tags: [tag1, tag2]               # opcjonalne
     needs_verification: false        # true, jeśli dane wymagają sprawdzenia
   ```

5. Pole, którego nie wypełniasz, po prostu **usuń całą linię** (nie zostawiaj np. `address: ""`
   jeśli naprawdę nie znasz adresu — wyjątkiem są `phone` i `website`, które mogą być
   pustym tekstem `""`, jeśli wolisz zostawić pole widoczne w danych).
6. Pole `id` musi być unikalne w całym pliku — dwa wpisy nie mogą mieć tego samego `id`.
7. Na dole strony kliknij „Commit changes…”, dodaj krótki opis zmiany (np. „Dodanie fryzjera X”)
   i zatwierdź.

## 3. Jak oznaczyć wpis „do weryfikacji” albo go usunąć

- **Do weryfikacji:** znajdź wpis w `places.yaml` i ustaw `needs_verification: true`.
  Na stronie pojawi się przy nim dyskretna etykieta „do weryfikacji”.
- **Usunięcie:** zaznacz i usuń cały blok wpisu (od `- id:` do linii przed następnym `- id:`),
  a potem zatwierdź zmianę (Commit changes).

## 4. Jak dodać nową kategorię

1. Otwórz `src/data/categories.yaml`.
2. Dodaj nowy blok na końcu listy:

   ```yaml
   - id: nowy-slug
     slug: nowy-slug
     name: Nazwa kategorii
     emoji: "🆕"
   ```

3. Pole `slug` (i `id` — muszą być takie same) musi być unikalne, małymi literami,
   ze myślnikami zamiast spacji.
4. Żeby przypisać wpisy do nowej kategorii, w `places.yaml` wpisz w polu `category`
   ten sam slug.

## 5. Jak sprawdzić, czy zmiana zadziałała (bez GitHub Actions)

Ta strona **nie korzysta z GitHub Actions** — budowanie i wystawianie strony robi
bezpośrednio Cloudflare Workers po każdym „Commit changes” na branchu `main`:

1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   otwórz projekt `ksieze-strona`.
2. Zakładka **Deployments** (lub **Builds**) pokazuje historię wdrożeń — zielony
   status „Success” znaczy, że strona się zbudowała i jest już opublikowana.
3. Czerwony status „Failed” — kliknij wdrożenie, żeby zobaczyć log błędu. Najczęstszy
   błąd to literówka w `places.yaml`/`categories.yaml`, np. nieznana kategoria albo
   brak cudzysłowu wokół numeru telefonu. Log pokaże, w którym wpisie jest problem.

## 6. Podmiana linku do formularza zgłoszeń i grupy FB

W pliku `src/config.ts` są dwa pola z tymczasowymi (pustymi) wartościami:

```ts
facebookGroupUrl: "", // TODO: wklej link do grupy FB „Księżanie”
reportFormUrl: "", // TODO: wklej link do Google Forms na zgłoszenia miejsc / poprawki danych
```

- Wklej link do grupy FB między cudzysłowy w `facebookGroupUrl`.
- Kiedy powstanie formularz Google Forms do zgłoszeń, wklej jego link do `reportFormUrl`.
- Dopóki `reportFormUrl` jest puste, przycisk „Zgłoś miejsce” na stronie głównej
  automatycznie pokazuje link do grupy FB (jeśli ten link jest ustawiony) albo się nie wyświetla.

Nie zapomnij też co jakiś czas zaktualizować `lastUpdated` w tym samym pliku
(format `RRRR-MM-DD`) — ta data widnieje w stopce strony jako „Ostatnia aktualizacja danych”.

## 7. Podłączenie Cloudflare Workers (jednorazowa konfiguracja)

Strona jest w pełni statyczna (bez żadnych funkcji serwerowych), więc do jej wystawienia
wystarczy darmowy plan Cloudflare i integracja z GitHubem — bez podawania żadnych kluczy API.

1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com) i zaloguj się na istniejące konto.
2. W menu po lewej wybierz **Workers & Pages** → **Create** → zakładka **Workers**.
3. Wybierz opcję **Import a repository** / **Connect to Git** i zaloguj się do GitHuba,
   jeśli Cloudflare o to poprosi (autoryzacja przez GitHub — bez wklejania żadnych tokenów).
4. Wskaż repozytorium `ksieze-strona` i branch `main`.
5. W ustawieniach builda wpisz:
   - **Build command:** `npm run build`
   - **Deploy command:** (Cloudflare wykryje `wrangler.jsonc` i katalog `./dist/` automatycznie)
6. Zatwierdź — Cloudflare zbuduje projekt i opublikuje go pod darmowym adresem
   `https://ksieze-strona.<twoja-nazwa>.workers.dev` (dokładny adres pokaże panel po wdrożeniu).
7. Od tej pory każdy „Commit changes” na branchu `main` (czyli każda Twoja edycja danych)
   automatycznie wywoła nowy build i publikację — nie trzeba nic więcej klikać.
8. Własną domenę można podpiąć później w tym samym projekcie, w zakładce **Settings → Domains & Routes**
   — na razie strona działa na darmowym adresie `workers.dev`.

## 8. Zasady dotyczące danych (przypomnienie)

- Numery telefonów zawsze w cudzysłowie, np. `"+48 608 603 666"`.
- Nie wpisujemy ocen czy opinii z Google — tylko fakty (nazwa, adres, telefon, opis).
- Lista jest bezpłatna i informacyjna — żaden wpis nie jest reklamą płatną.
