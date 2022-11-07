// Couches restantes à charger
var remaining = 4;
var loadingPanel;
CUB.ready(function () {
    // Initialisation de l'API CUB
    CUB.init(document.getElementById('map'), {
        extent: [1411539.71, 4185738.74, 1424239.7, 4192214.41]
    });
    // Création du Panel conteneur de la mire
    loadingPanel = new CUB.Panel({
        width: 48,
        height: 48,
        top: CUB.getHeight() / 2 - 24,
        left: CUB.getWidth() / 2 - 24,
        content: '<img src="https://data.bordeaux-metropole.fr/dev/exemples/samples/loading.gif" style="border: 1px solid black"/>'
    });
    // Chargement des lignes de tram
    var lignes = [
        { ligneGid: 59, nom: 'Ligne A', label: 'A', color: '#81197F' },
        { ligneGid: 60, nom: 'Ligne B', label: 'B', color: '#DA003E' },
        { ligneGid: 61, nom: 'Ligne C', label: 'C', color: '#D15094' },
        { ligneGid: 62, nom: 'Ligne D', label: 'D', color: '#91619D' }
    ];
    for (var _i = 0, lignes_1 = lignes; _i < lignes_1.length; _i++) {
        var ligne = lignes_1[_i];
        createLigne(ligne.ligneGid, ligne.nom, ligne.color);
        createVehicule(ligne.ligneGid, ligne.label, ligne.color);
        createVehiculeOnTime(ligne.ligneGid, ligne.label, ligne.color);
    }
});
/**
 * Charge une ligne de tram sur la carte
 * @param ligneGid GID de la ligne
 * @param nom
 */
function createLigne(ligneGid, nom, color) {
    var layer = new CUB.Layer.Dynamic(nom, 'https://data.bordeaux-metropole.fr/wfs?key=258BILMNYZ', {
        layerName: 'SV_CHEM_L',
        // Filtre sur l'ID de la ligne + uniquement les chemins principaux
        wfsFilter: "<And><PropertyIsEqualTo><PropertyName>RS_SV_LIGNE_A</PropertyName><Literal>".concat(ligneGid, "</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>PRINCIPAL</PropertyName><Literal>1</Literal></PropertyIsEqualTo></And>"),
        propertyname: ['GID', 'LIBELLE'],
        loadAllAtOnce: true,
        style: new CUB.Style({
            color: new CUB.Color(color)
        })
    });
    // Callback de fin de chargement
    layer.onLoadEnd = function () { return onLayerLoadEnd(layer); };
    return layer;
}
/**
 * Crée la couche des véhivules
 */
function createVehicule(ligneGid, label, color) {
    var layer = new CUB.Layer.Dynamic('Tram ' + label + "en retard", 'https://data.bordeaux-metropole.fr/wfs?key=258BILMNYZ', {
        layerName: 'SV_VEHIC_P',
        // Filtre sur l'ID de la ligne + uniquement les chemins principaux
        // wfsFilter: `<AND><PropertyIsEqualTo><PropertyName>RS_SV_LIGNE_A</PropertyName><Literal>${ligneGid}</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>etat</PropertyName><Literal>RETARD</Literal></PropertyIsEqualTo></AND>`,
        wfsFilter: "<AND><PropertyIsEqualTo><PropertyName>RS_SV_LIGNE_A</PropertyName><Literal>".concat(ligneGid, "</Literal></PropertyIsEqualTo><PropertyIsGreaterThan><PropertyName>retard</PropertyName><Literal>30</Literal></PropertyIsGreaterThan></AND>"),
        propertyname: ['GEOM', 'TERMINUS', 'RETARD'],
        loadAllAtOnce: true,
        refreshInterval: 10000,
        style: new CUB.Style({
            symbol: "https://data.bordeaux-metropole.fr/opendemos/assets/images/saeiv/tram_".concat(label.toLowerCase(), ".png"),
            opacity: 100,
            size: 10,
            labelColor: new CUB.Color(color),
            labelOutlineWidth: 1.5,
            labelSize: 12,
            labelBold: true,
            label: '${TERMINUS} - ${RETARD}',
            labelYOffset: -15,
            labelMaxScaledenom: 25000
        })
    });
}
/**
 * Crée la couche des véhivules
 */
function createVehiculeOnTime(ligneGid, label, color) {
    var layer = new CUB.Layer.Dynamic('Tram ' + label + "à l'heure", 'https://data.bordeaux-metropole.fr/wfs?key=258BILMNYZ', {
        layerName: 'SV_VEHIC_P',
        // Filtre sur l'ID de la ligne + uniquement les chemins principaux
        // wfsFilter: `<AND><PropertyIsEqualTo><PropertyName>RS_SV_LIGNE_A</PropertyName><Literal>${ligneGid}</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>etat</PropertyName><Literal>RETARD</Literal></PropertyIsEqualTo></AND>`,
        wfsFilter: "<AND><PropertyIsEqualTo><PropertyName>RS_SV_LIGNE_A</PropertyName><Literal>".concat(ligneGid, "</Literal></PropertyIsEqualTo><PropertyIsLessThan><PropertyName>retard</PropertyName><Literal>31</Literal></PropertyIsLessThan></AND>"),
        propertyname: ['GEOM', 'TERMINUS', 'RETARD'],
        loadAllAtOnce: true,
        refreshInterval: 10000,
        style: new CUB.Style({
            symbol: "https://data.bordeaux-metropole.fr/opendemos/assets/images/saeiv/tram_".concat(label.toLowerCase(), ".png"),
            opacity: 75,
            size: 10,
            labelColor: new CUB.Color(color),
            labelOutlineWidth: 1,
            labelSize: 9,
            labelBold: true,
            label: '${TERMINUS} - ${RETARD}',
            labelYOffset: -15,
            labelMaxScaledenom: 25000
        })
    });
}
/**
 * Fin de chargement d'une couche WFS
 * @param layer La couche WFS
 */
function onLayerLoadEnd(layer) {
    --remaining;
    if (remaining === 0)
        loadingPanel.disable();
}
