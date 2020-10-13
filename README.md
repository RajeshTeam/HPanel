# KoronaPanel
Aplikacja na konkurs HackHeroes

# Wielka ~~Improwizacja~~ Instalacja
- Instalujemy apkę o nazwie GIT: https://github.com/git-for-windows/git/releases/download/v2.28.0.windows.1/Git-2.28.0-64-bit.exe
- Instalujemy apkę do zarządzania środowiskiem Node: https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-setup.zip
- Odpalamy wiersz polecenia i przechodzimy do pulpitu ("cd Desktop")
- Wklepujemy kolejno:
  - git clone https://github.com/RajeshTeam/HPanel (wyświetli komunikat o podaniu hasła itd. Kopiuje to repo tego kodu)
  - cd HPanel
  - nvm install 14.13.1 (instalujemy tym Node, łatwo i przyjemnie)
  - npm install (komenda npm, która pobiera paczki dla naszej apki
- Żeby odpalić apkę, wpisujemy "node index.js". Apka będzie widoczna, gdy w przeglądarce w pasku adresu wpiszemy "localhost".
- Edytujcie apkę czymkolwiek, może być Paintem.
- Jeżeli wasz edytor nie ogarnia Gita lub jest to dla was nieczytelne, wysyłanie zmian robi się tak:
  - git add . (dodaje wszystkie pliki)
  - git commit -m "Aktualizacja" (wykonuje tzw. commit + dodaje nazwe, pls nazywajcie commity jakoś sensownie)
  - git push (wysyła zmiany ostatecznie)
- Jeżeli chcecie pobrać zmiany, to wystarczy ciepnąć "git pull".
- Jak coś nie działa, piszcie do Rajesha.
