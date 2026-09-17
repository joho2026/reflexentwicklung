# Reflex Entwicklung – Website

Fertige statische Website für **Garbus Desirée – Trainerin für Reflexintegration**.

## Dateien im Hauptordner

- `index.html` – One-Page-Startseite
- `impressum.html` – Impressum
- `datenschutzerklaerung.html` – Datenschutzerklärung
- `404.html` – Fehlerseite
- `Foto_Desiree.jpg` und `Foto_Desiree.png` – Original-/Ausgabefoto
- `robots.txt` und `sitemap.xml` – Suchmaschinen
- `site.webmanifest`, `favicon.ico` – Browser-/Handy-Icons
- `CNAME` – gewünschte Domain `reflexentwicklung.at`
- `assets/` – CSS, JavaScript, Logos, optimierte Bilder und Icons

## GitHub-Repository anlegen

1. Auf GitHub rechts oben auf **+** → **New repository**.
2. Repository name: `reflexentwicklung`
3. Description: `Website für Reflex Entwicklung – Garbus Desirée`
4. Visibility: **Public**
5. **Add a README file:** nicht auswählen
6. **Add .gitignore:** None
7. **Choose a license:** None
8. **Create repository** anklicken.
9. Im neuen Repository **Add file** → **Upload files**.
10. Den gesamten **Inhalt dieses Ordners** hochladen. Nicht noch einen zusätzlichen Oberordner erzeugen.
11. Commit message: `Initial website launch`
12. **Commit changes**.

## GitHub Pages aktivieren

1. Repository → **Settings** → **Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **main**.
4. Folder: **/(root)**.
5. **Save**.
6. Unter **Custom domain** `reflexentwicklung.at` eintragen.
7. Sobald DNS korrekt ist, **Enforce HTTPS** aktivieren.

## Domain-DNS für GitHub Pages

Für die Hauptdomain `reflexentwicklung.at` beim Domainanbieter folgende A-Records setzen:

- `@` → `185.199.108.153`
- `@` → `185.199.109.153`
- `@` → `185.199.110.153`
- `@` → `185.199.111.153`

Für `www`:

- `www` als CNAME → `<DEIN-GITHUB-BENUTZERNAME>.github.io`

Wichtig: Die Website-DNS-Einträge (A/CNAME) und die E-Mail-DNS-Einträge (MX/TXT) können gleichzeitig bestehen.

## Google Workspace und desiree@reflexentwicklung.at

Das bestehende Google-Konto mit `g.desiree@gmx.at` kann privat bestehen bleiben. Für das Unternehmen wird ein separates Google-Workspace-Konto angelegt.

1. Google Workspace aufrufen und **Business Starter** auswählen.
2. **Vorhandene Domain verwenden**: `reflexentwicklung.at`.
3. Unternehmens-/Kontaktdaten von Desirée eintragen.
4. Ersten Nutzer anlegen:
   - Vorname: `Desirée`
   - Nachname: `Garbus`
   - Nutzername: `desiree`
   - Ergebnis: `desiree@reflexentwicklung.at`
5. Ein starkes, eigenes Passwort festlegen.
6. Private Wiederherstellungsadresse eintragen, z. B. die bestehende GMX-Adresse.
7. Zwei-Faktor-Authentifizierung aktivieren.
8. Den von Google angezeigten TXT-Verifizierungseintrag beim Domainanbieter exakt übernehmen.
9. In der Google-Admin-Konsole Gmail aktivieren und die dort aktuell angezeigten MX-Einträge beim Domainanbieter setzen.
10. Danach SPF, DKIM und DMARC einrichten. Die konkreten Werte immer aus der aktuellen Google-Admin-Konsole übernehmen.

Nicht versuchen, das bestehende private Google-Konto in das Workspace-Konto umzuwandeln. Beide Konten werden getrennt verwendet und können gleichzeitig am Handy angemeldet sein.

## Vor Veröffentlichung prüfen

- Website und alle Menüpunkte auf Handy und Desktop testen.
- E-Mail-Link und Telefon-Link testen.
- Impressum und Datenschutz nochmals fachlich prüfen lassen, falls sich Tätigkeit, Hosting, E-Mail-Anbieter oder Website-Funktionen ändern.
- Keine zusätzlichen Analyse-, Karten-, Social-Media- oder Buchungsdienste einbauen, ohne die Datenschutzinformationen entsprechend anzupassen.
