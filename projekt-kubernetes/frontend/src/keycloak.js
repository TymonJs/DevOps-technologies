import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost/auth",
    realm: "myrealm",
    clientId: "react-app"
})

export default keycloak;