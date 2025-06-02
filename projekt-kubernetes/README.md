## Uruchomienie projektu
Na poziomie folderu **/projekt-kubernetes** należy użyć kolejnych instrukcji:
 * Zastosowanie kontrolera ingress-nginx: ``kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml``
 * Zastosowanie plików projektu w default namespace: ``kubectl apply -f ./kub``
 * Aby uruchomić projekt w niestandardowym namespace należy zmienić wartość zmiennej **NAMESPACE** w pliku **/kub/api-configmap.yaml** na nazwę wybranego namespace. W takim przypadku zastosowanie plików będzie następujące: ``kubectl apply -f ./kub -n <namespace-name>``

## Routing
 * Keycloak: localhost/auth
 * API: localhost/api
 * Frontend: localhost/

## Panel admina
Aby użytkownik miał dostęp do panelu admina należy wejść w konsolę administracyjną Keycloak i dodać wybranemu użytkownikowi rolę **admin**.