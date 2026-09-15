# Księże – katalog usług i sklepów (brief projektu)

Ten plik jest instrukcją startową dla Claude Code. Opisuje cel projektu, założenia techniczne, strukturę danych i dane początkowe.

## 1. Cel

Prosta, szybka strona internetowa dla mieszkańców wrocławskiego osiedla Księże (grupa FB „Księżanie”). Ma zastąpić długi post na Facebooku listą usług, sklepów i instytucji na osiedlu i w najbliższej okolicy.

Najważniejsze potrzeby:
- mieszkaniec na telefonie w kilka sekund znajduje np. weterynarza lub fryzjera,
- moderator (osoba nietechniczna, ale obeznana z danymi) łatwo dodaje i edytuje wpisy bez dotykania kodu,
- strona jest darmowa w utrzymaniu i nie wymaga serwera ani bazy danych.

## 2. Założenia techniczne

- **Generator statyczny:** Astro (najnowsza stabilna wersja), TypeScript.
- **Dane:** jeden plik `src/data/places.yaml`, walidowany schematem (Astro Content Collections + Zod). Błąd w danych ma przerwać build z czytelnym komunikatem.
- **Style:** czysty CSS lub Tailwind, mobile-first. Bez ciężkich frameworków UI.
- **Interaktywność:** minimalny JS po stronie klienta, tylko do wyszukiwarki i filtrów (vanilla JS lub mała wyspa Astro). Strona musi działać czytelnie także bez JS (pełna lista pogrupowana kategoriami).
- **Hosting:** GitHub Pages, Netlify lub Cloudflare Pages (darmowe). Deploy automatyczny po pushu na `main` (GitHub Actions).
- **Prywatność:** brak cookies śledzących i Google Analytics. Jeśli statystyki, to bezcookie (np. Plausible/GoatCounter) i dopiero po decyzji moderatora.
- **Język strony:** polski. Kod, nazwy plików i pola danych po angielsku.

## 3. Funkcje (MVP)

1. Strona główna: wyszukiwarka (nazwa, opis, tagi, adres), kafelki kategorii, data ostatniej aktualizacji.
2. Filtry: kategoria oraz lokalizacja (🏠 Na Księżu / 📍 W pobliżu / 🚐 Z dojazdem).
3. Karta wpisu: nazwa, opis, adres (link do mapy OpenStreetMap/Google Maps po adresie), telefon jako `tel:` do kliknięcia, strona www, tagi, oznaczenie „do weryfikacji”.
4. Podstrona kategorii z podziałem na sekcje Na Księżu / W pobliżu / Z dojazdem.
5. Sekcja „Ważne telefony” zawsze łatwo dostępna (np. w stopce lub osobna zakładka).
6. Przycisk „Zgłoś miejsce / popraw dane” prowadzący do formularza (na start link do Google Forms, adres podany w konfiguracji `src/config.ts`).
7. Stopka: informacja, że lista ma charakter informacyjny, wpisy nie są płatne, link do grupy FB, data aktualizacji.

## 4. Funkcje na później (nie robić w MVP)

- Mapa wszystkich miejsc (Leaflet + OpenStreetMap, bez klucza API), wymaga dodania współrzędnych do danych.
- Godziny otwarcia z oznaczeniem „otwarte teraz”.
- Panel edycji dla moderatora (np. Decap CMS) zamiast ręcznej edycji YAML.
- Eksport listy do tekstu gotowego do wklejenia na Facebooka (skrypt generujący post z tych samych danych).

## 5. Schemat danych

```yaml
- id: mill-vet                # unikalny slug, małe litery i myślniki
  name: Mill-Vet
  category: animals           # slug z listy kategorii poniżej
  location: ksieze            # ksieze | nearby | mobile
  address: Rybnicka 27        # ulica i numer; Wrocław domyślnie
  phone: "+48 608 603 666"    # opcjonalne, zawsze w cudzysłowie
  website: ""                 # opcjonalne
  description: Gabinet weterynaryjny
  tags: [weterynarz, kastracja, chipowanie]   # opcjonalne, pomagają w wyszukiwaniu
  needs_verification: false   # true = pokaż dyskretną etykietę „do weryfikacji”
```

Zasady:
- `phone` normalizować do formatu `+48 XXX XXX XXX` przy wyświetlaniu, a w linku `tel:` bez spacji.
- Brak pola = nie wyświetlać elementu (bez pustych etykiet).
- Sortowanie w sekcji alfabetyczne po `name` (z polską kolacją `localeCompare('pl')`).
- Nie przechowujemy ocen ani opinii z Google. Tylko dane faktograficzne.

## 6. Kategorie

| slug | nazwa | emoji |
|---|---|---|
| shops | Sklepy i codzienne zakupy | 🛒 |
| bakeries-cafes | Piekarnie, cukiernie, kawiarnie | 🥐 |
| food | Gastronomia i dowóz | 🍕 |
| beauty | Fryzjer, barber i beauty | 💇 |
| health | Zdrowie | 🏥 |
| animals | Zwierzęta | 🐾 |
| kids-education | Dzieci i edukacja | 👶 |
| sport | Sport i rekreacja | ⚽ |
| home-repairs | Dom i remonty | 🔧 |
| small-services | Usługi drobne (krawiec, szewc, klucze, pralnia) | 🧵 |
| automotive | Motoryzacja | 🚗 |
| garden | Ogród i zieleń | 🌿 |
| post-parcels | Poczta i paczki | 📦 |
| institutions | Instytucje i wspólnota | 🏛️ |

Kategorie trzymać w osobnym pliku `src/data/categories.yaml`, żeby moderator mógł dodać nową bez zmian w kodzie. Kategoria bez wpisów ma się wyświetlać z zachętą „Znasz kogoś godnego polecenia? Zgłoś!”.

## 7. Dane startowe

Uwaga: osiedle Księże obejmuje Księże Małe, Księże Wielkie, Świątniki, Opatowice i Bierdzany. Adresy przy Krakowskiej 180–182 również należą do Księża. Dane zebrano z publicznych wizytówek i wymagają okresowej weryfikacji przez moderatora.

Przenieś poniższe dane do `src/data/places.yaml` i `src/data/emergency.yaml`.

```yaml
# ===== SKLEPY =====
- id: supermarket-tj
  name: Supermarket T&J
  category: shops
  location: ksieze
  address: Zagłębiowska 3
  phone: "+48 71 344 03 37"
  description: Supermarket osiedlowy
- id: u-zenka
  name: U Zenka
  category: shops
  location: ksieze
  address: Bytomska 1
  phone: "+48 502 337 496"
  description: Warzywa i owoce
  tags: [warzywniak]
- id: sklep-rabat
  name: Sklep spożywczy Rabat
  category: shops
  location: ksieze
  address: Chorzowska 10
  phone: "+48 71 340 07 39"
  description: Sklep spożywczy
  needs_verification: true   # pod tym samym adresem figuruje też ABC po sąsiedzku
- id: abc-po-sasiedzku
  name: ABC po sąsiedzku
  category: shops
  location: ksieze
  address: Chorzowska 10
  description: Sklep spożywczy
  needs_verification: true
- id: spolem-poludnie
  name: Społem „Południe”
  category: shops
  location: ksieze
  address: Opolska 63
  phone: "+48 71 371 82 41"
  description: Sklep wielobranżowy PSS Społem
- id: napoleon
  name: Napoleon
  category: shops
  location: ksieze
  address: Opolska 7
  description: Sklep alkoholowy, duży wybór piw
- id: zabka-gornoslaska
  name: Żabka
  category: shops
  location: ksieze
  address: Górnośląska 2b
  tags: [paczki]
- id: zabka-blizanowicka
  name: Żabka
  category: shops
  location: ksieze
  address: Blizanowicka 38
  tags: [paczki]
- id: zabka-opolska
  name: Żabka
  category: shops
  location: ksieze
  address: Opolska 121A
  tags: [paczki]
- id: zabka-rybnicka
  name: Żabka
  category: shops
  location: ksieze
  address: Rybnicka 8a
  tags: [paczki]

# ===== PIEKARNIE, KAWIARNIE =====
- id: swojska-wyzera
  name: Swojska Wyżera
  category: bakeries-cafes
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 515 716 446"
  description: Piekarnia
- id: bakery-opolska
  name: Bakery Opolska
  category: bakeries-cafes
  location: ksieze
  address: Opolska 24
  phone: "+48 71 342 49 02"
  description: Piekarnia
- id: piekarnia-hert
  name: Piekarnia Hert
  category: bakeries-cafes
  location: ksieze
  address: ""
  phone: "+48 577 837 133"
  description: Piekarnia
  needs_verification: true   # brak dokładnego adresu
- id: dialog-cafe
  name: Dialog Cafe by Samborini
  category: bakeries-cafes
  location: ksieze
  address: Krakowska 180, lokal G1
  description: Kawiarnia, lody, gofry
- id: przystanek-lola
  name: Przystanek Lola
  category: bakeries-cafes
  location: nearby
  address: Semaforowa 4
  description: Lody
  tags: [lody]

# ===== GASTRONOMIA =====
- id: dym-na-opolskiej
  name: Dym na Opolskiej
  category: food
  location: ksieze
  address: Opolska 140
  phone: "+48 571 519 596"
  description: Pizza, dowóz
  tags: [pizza, dowóz]
- id: ale-knysza
  name: Ale Knysza
  category: food
  location: ksieze
  address: Opolska 136
  phone: "+48 694 240 123"
  description: Knysze, tortille
- id: giro
  name: Giro
  category: food
  location: ksieze
  address: Krakowska 182
  phone: "+48 609 010 806"
  description: Pizza i kuchnia włoska
  tags: [pizza]
- id: milli
  name: Milli
  category: food
  location: nearby
  address: Birmańska 13
  phone: "+48 734 147 871"
  description: Restauracja, pizza i kuchnia włoska

# ===== BEAUTY =====
- id: fryzjer-matrix
  name: Fryzjer Matrix
  category: beauty
  location: ksieze
  address: Chorzowska 8/1b
  phone: "+48 505 156 159"
  description: Fryzjer
- id: salon-laris
  name: Salon Laris
  category: beauty
  location: ksieze
  address: Katowicka 23
  phone: "+48 71 341 18 93"
  description: Fryzjer
- id: salon-monika
  name: Salon fryzjerski Monika
  category: beauty
  location: ksieze
  address: Świątnicka 11
  phone: "+48 71 343 59 42"
  description: Fryzjer damski
- id: salonik-zaglebiowska
  name: Salonik fryzjersko-kosmetyczny
  category: beauty
  location: ksieze
  address: Zagłębiowska 6/3
  phone: "+48 669 332 616"
  description: Fryzjer, kosmetyka
- id: galeria-urody-lady-ab
  name: Galeria Urody Lady A.B.
  category: beauty
  location: ksieze
  address: Chorzowska 4/1b
  phone: "+48 731 323 994"
  description: Fryzjer, manicure, henna
- id: beautiful-mom
  name: Salon Beautiful Mom
  category: beauty
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 600 661 638"
  description: Manicure, pedicure, rzęsy
- id: studio-kosmetyki-profesjonalnej
  name: Studio Kosmetyki Profesjonalnej
  category: beauty
  location: ksieze
  address: Chorzowska 36/1a
  phone: "+48 607 258 268"
  description: Kosmetyczka, depilacja
- id: butterfly
  name: Studio Zdrowia i Urody ButterFly
  category: beauty
  location: ksieze
  address: Rybnicka 44
  phone: "+48 669 292 533"
  description: Kosmetyka
- id: podolog-chudzikowska-las
  name: Gabinet podologiczny B. Chudzikowskiej-Łaś
  category: beauty
  location: ksieze
  address: Rybnicka 23
  phone: "+48 501 506 846"
  description: Podologia, pedicure
  tags: [podolog]
- id: hair-zychal
  name: Hair Zychal
  category: beauty
  location: ksieze
  address: Krakowska 180
  phone: "+48 509 400 026"
  description: Fryzjer
- id: stopkolandia
  name: Stópkolandia
  category: beauty
  location: nearby
  address: Międzyleska 84
  phone: "+48 539 979 703"
  description: Gabinet podologiczny, pedicure
  tags: [podolog]

# ===== ZDROWIE =====
- id: apteka-ksiezeca
  name: Apteka Księżęca
  category: health
  location: ksieze
  address: Chorzowska 2
  phone: "+48 71 340 05 50"
  tags: [apteka]
- id: apteka-doz-tarnogorska
  name: Apteka DOZ
  category: health
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 71 340 00 10"
  tags: [apteka]
- id: praktyka-lekarzy-rodzinnych
  name: Praktyka grupowa lekarzy rodzinnych
  category: health
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 71 342 17 25"
  description: Lekarz rodzinny (NFZ)
  tags: [przychodnia, poz]
- id: frontida
  name: Centrum Usług Medycznych Frontida
  category: health
  location: ksieze
  address: Opolska 188
  phone: "+48 884 882 221"
  description: Przychodnia (NFZ), punkt pobrań
  tags: [przychodnia, poz, pobrania]
- id: aldent
  name: Gabinet stomatologiczny Aldent (lek. dent. Anna Leśnikowska)
  category: health
  location: ksieze
  address: Opolska 125/8
  phone: "+48 660 004 664"
  tags: [dentysta, stomatolog]
- id: anima-stomatologia
  name: Anima Gabinety Stomatologiczne
  category: health
  location: ksieze
  address: Opolska 11-19, lokal 2
  phone: "+48 71 341 64 86"
  tags: [dentysta, stomatolog]
- id: fizjo-bernacki
  name: Fizjoterapeuta Dominik Bernacki
  category: health
  location: ksieze
  address: Opolska 188
  tags: [fizjoterapia]
- id: fizjoterapia-hd
  name: FizjoTerapia HD
  category: health
  location: ksieze
  address: Krakowska 180, bud. A, lokal 9
  phone: "+48 660 406 564"
  tags: [fizjoterapia]
- id: ar-med
  name: NZOZ AR-MED
  category: health
  location: nearby
  address: Chińska 4
  phone: "+48 71 717 35 21"
  tags: [przychodnia, poz]
- id: broch-med
  name: Broch-med
  category: health
  location: nearby
  address: Węgierska 6
  phone: "+48 71 343 21 13"
  tags: [przychodnia, poz]
- id: medib
  name: MEDIB Fizjoterapia
  category: health
  location: nearby
  address: Gazowa 84
  phone: "+48 530 206 416"
  tags: [fizjoterapia]

# ===== ZWIERZĘTA =====
- id: mill-vet
  name: Mill-Vet
  category: animals
  location: ksieze
  address: Rybnicka 27
  phone: "+48 608 603 666"
  description: Gabinet weterynaryjny
  tags: [weterynarz]
- id: panaceum-vet
  name: Panaceum
  category: animals
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 669 684 566"
  description: Gabinet weterynaryjny
  tags: [weterynarz]
  needs_verification: true
- id: vetlab
  name: Vetlab
  category: animals
  location: ksieze
  address: Wodzisławska 6
  phone: "+48 71 722 35 25"
  description: Laboratorium weterynaryjne
- id: animalvet
  name: AnimalVet
  category: animals
  location: nearby
  address: Gazowa 82
  phone: "+48 781 839 555"
  description: Przychodnia weterynaryjna
  tags: [weterynarz]
- id: dolvet
  name: Dolvet
  category: animals
  location: nearby
  address: Ziębicka 32
  phone: "+48 71 735 17 40"
  description: Przychodnia weterynaryjna czynna całodobowo
  tags: [weterynarz, całodobowy]

# ===== DZIECI I EDUKACJA =====
- id: przedszkole-57
  name: Przedszkole nr 57 „Mały Książę”
  category: kids-education
  location: ksieze
  address: Chorzowska 55
  phone: "+48 71 798 68 00"
  tags: [przedszkole]
- id: przedszkole-logicus
  name: Publiczne Przedszkole Logicus
  category: kids-education
  location: ksieze
  address: Raciborska 2
  phone: "+48 501 670 035"
  tags: [przedszkole]
- id: sp-99
  name: Szkoła Podstawowa nr 99
  category: kids-education
  location: ksieze
  address: Głubczycka 3
  phone: "+48 71 798 68 79"
  tags: [szkoła]

# ===== SPORT =====
- id: sc-athlete-factory
  name: S&C Athlete Factory
  category: sport
  location: ksieze
  address: Świątnicka 36
  phone: "+48 791 739 222"
  description: Studio treningowe, trening personalny
- id: street-workout-gliwicka
  name: Street Workout Park
  category: sport
  location: ksieze
  address: Gliwicka
  description: Plenerowa siłownia do kalisteniki
- id: park-wschodni
  name: Park Wschodni
  category: sport
  location: ksieze
  address: ""
  description: Park z placem zabaw
  tags: [plac zabaw, spacer]
- id: performance-strength-coach
  name: Performance Strength Coach
  category: sport
  location: nearby
  address: Międzyleska 4
  phone: "+48 601 709 704"
  description: Siłownia, trójbój
- id: street-workout-tarnogaj
  name: Street Workout – Park Tarnogajski
  category: sport
  location: nearby
  address: Park Tarnogajski
  description: Plenerowa siłownia do kalisteniki

# ===== MOTORYZACJA =====
- id: martom-auto
  name: Martom Auto
  category: automotive
  location: ksieze
  address: Opolska 11/19
  phone: "+48 536 536 607"
  tags: [mechanik]
- id: rak-auto
  name: Rak-Auto
  category: automotive
  location: ksieze
  address: Opolska 11-19
  phone: "+48 695 947 252"
  tags: [mechanik]
- id: robert-garage
  name: Robert Garage
  category: automotive
  location: ksieze
  address: Opolska 11/19
  phone: "+48 791 725 765"
  description: Mechanik, obsługa także po angielsku
  tags: [mechanik, english]
- id: ag-auto
  name: AG Auto
  category: automotive
  location: ksieze
  address: Opolska 19B
  phone: "+48 516 018 253"
  description: Serwis, opony, konserwacja
  tags: [mechanik, wulkanizacja]
- id: pro100-serwis
  name: Pro100 Serwis
  category: automotive
  location: ksieze
  address: Opolska 153
  phone: "+48 573 495 557"
  tags: [mechanik]
- id: auto-check-in-center
  name: Auto Check-in Center
  category: automotive
  location: ksieze
  address: Opolska 188G
  phone: "+48 575 475 888"
  tags: [mechanik]

# ===== POCZTA =====
- id: poczta-chorzowska
  name: Poczta Polska
  category: post-parcels
  location: ksieze
  address: Chorzowska 4/6
  phone: "+48 71 347 17 82"

# ===== INSTYTUCJE =====
- id: parafia-nmp
  name: Parafia NMP Wspomożycielki Wiernych
  category: institutions
  location: ksieze
  address: Świątnicka 32
  phone: "+48 71 343 79 76"
- id: biblioteka-filia-46
  name: Miejska Biblioteka Publiczna – Filia nr 46
  category: institutions
  location: ksieze
  address: Tarnogórska 1
  phone: "+48 71 347 12 80"
- id: rada-osiedla
  name: Rada Osiedla Księże
  category: institutions
  location: ksieze
  address: Rybnicka 39-41
  website: "mailto:ksieze@osiedla.wroclaw.pl"
  description: Siedziba Samorządu Osiedla, dyżury radnych
  needs_verification: true   # dane z artykułu sprzed wyborów, sprawdzić godziny dyżurów
```

```yaml
# src/data/emergency.yaml
- label: Numer alarmowy
  phone: "112"
- label: Straż Miejska
  phone: "986"
- label: Pogotowie energetyczne
  phone: "991"
- label: Pogotowie gazowe
  phone: "992"
- label: Dzielnicowy
  phone: ""   # do uzupełnienia
- label: Awarie wodociągowe MPWiK
  phone: ""   # do uzupełnienia
```

## 8. Instrukcja dla moderatora (do README)

Po zbudowaniu projektu utwórz `README.md` po polsku, pisany dla osoby nietechnicznej:
1. Jak dodać nowy wpis (skopiuj blok, zmień pola, zapisz, commit przez interfejs GitHuba).
2. Jak oznaczyć wpis do weryfikacji albo go usunąć.
3. Jak dodać kategorię.
4. Jak sprawdzić, czy build przeszedł (zakładka Actions).

## 9. Kryteria gotowości MVP

- `npm run build` przechodzi bez błędów, walidacja danych działa (celowo błędny wpis psuje build z czytelnym komunikatem).
- Lighthouse na mobile: Performance, Accessibility, SEO ≥ 90.
- Wyszukiwarka toleruje brak polskich znaków (np. „ksiezeca” znajduje „Księżęca”).
- Numery telefonów klikalne, adresy otwierają mapę w nowej karcie.
- Poprawne meta tagi i Open Graph (ładny podgląd linku wklejonego na Facebooka).
- Działa w trybie jasnym i ciemnym.

## 10. Sposób pracy

- Zacznij od planu i struktury katalogów, pokaż je przed pisaniem kodu.
- Pracuj małymi krokami, po każdym etapie uruchom `npm run build`.
- Nie dodawaj zależności bez uzasadnienia.
- Pytaj, gdy decyzja dotyczy wyglądu, nazwy domeny albo usług zewnętrznych.
