import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://sso.apecgroup.net',
    realm: 'APECDigital',
    clientId: 'APECDigitalBE',
});

export default keycloak;
