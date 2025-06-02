## Uruchomienie projektu
Na poziomie folderu **/projekt-docker** należy użyć komendy ``docker compose up``

## Routing
 * Keycloak: localhost:8080
 * PostgreSQL: localhost:5432
 * API: localhost:3001
 * Frontend: localhost:3000

## Panel admina
Aby użytkownik miał dostęp do panelu admina należy wejść w konsolę administracyjną Keycloak w realmie **myrealm** na **localhost:8080** i dodać wybranemu użytkownikowi rolę **admin**.