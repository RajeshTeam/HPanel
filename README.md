# HPanel
Aplikacja na konkurs HackHeroes - HealthPanel

# Ważna informacja w sprawie adresu domeny!
Strona była dostępna pod adresem podanym w formularzu zgłoszeniowym https://healthpanel.tk. Niestety, dostawca darmowych domen Freenom postanowiła zresetować ustawienia DNS tejże domeny, a przy okazji zepsuć sobie panel administracyjny (w chwili pisania tego tekstu, https://my.freenom.com/clientarea.php zwraca naprzemian błędy 502 i 504). Mając nadzieję, że jury HackHeroes zauważy tę notkę, prosimy ją o kierowanie się na https://healthpanel.boombo.xyz, którą jest adresem (mamy nadzieję) tymczasowym. Pragniemy również zauważyć, że pomimo wstawienia tej notki PO czasie oddawania aplikacji, jedyne zmiany znajdują się tylko w tym oto README.md, co widać w historii commitów (poprzednim commitem jest [ten](
https://github.com/RajeshTeam/HPanel/commit/f16e2089d8d9d5f467db37d1d8229a0f207f6448), który został wykonany przed deadlinem, co widać również [tu](https://github.com/RajeshTeam/HPanel/commits/main)). Przepraszamy za komplikacje, a usługodawcę Freenom pozdrawiamy wiadomo jakim palcem.

# Wielka ~~Improwizacja~~ Instalacja
- Instalujemy apkę o nazwie GIT: https://github.com/git-for-windows/git/releases/download/v2.28.0.windows.1/Git-2.28.0-64-bit.exe
- Instalujemy apkę do zarządzania środowiskiem Node: https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-setup.zip
- Odpalamy wiersz polecenia i przechodzimy do pulpitu ("cd Desktop")
- Wklepujemy kolejno:
  - git clone https://github.com/RajeshTeam/HPanel (wyświetli komunikat o podaniu hasła itd. Kopiuje to repo tego kodu)
  - cd HPanel
  - nvm install 15.0.1 (instalujemy tym Node, łatwo i przyjemnie)
  - npm install (komenda npm, która pobiera paczki dla naszej apki
- Żeby odpalić apkę, wpisujemy "node index.js". Apka będzie widoczna, gdy w przeglądarce w pasku adresu wpiszemy "localhost:8080".
