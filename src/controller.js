import Claim from './Model/Claim'

export function startNewClaim() {
    var claim = new Claim("claim1");
    return claim;
}
