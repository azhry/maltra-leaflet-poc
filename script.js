const layerFilters = [
    {
        label: 'Menara Reguler Telkomsel',
        id: 'menara_reguler_telkomsel',
        bgcolor: '#FF5050',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Menara Non 3T Telkomsel',
        id: 'menara_non_3t_telkomsel',
        bgcolor: '#28C27D',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Menara USO BAKTI Kominfo',
        id: 'menara_uso_bakti_kominfo',
        bgcolor: '#FFC93D',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Menara Merah Putih Telkomsel',
        id: 'menara_merah_putih_telkomsel',
        bgcolor: '#D413AA',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Menara Roof Top',
        id: 'menara_roof_top',
        bgcolor: '#FF820F',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Menara Combat',
        id: 'menara_combat',
        bgcolor: '#92949D',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
    {
        label: 'Usulan Pembangunan Menara',
        id: 'usulan_pembangun_negara',
        bgcolor: '#3D86CF',
        opacity: 0.5,
        checked: true,
        shown: true,
    },
];

$(document).ready(() => {
    function renderLayerFilters() {
        $('#filter-layer').html('');
        layerFilters.forEach((filter) => {
            if (filter.shown) {
                $('#filter-layer').append(`
                    <div class="form-check filter-layer-item">
                        <div class="filter-checkbox">
                            <input ${filter.checked ? 'checked' : ''} class="form-check-input" type="checkbox" value="${filter.id}">
                            <label class="form-check-label">
                                ${filter.label}
                            </label>
                        </div>
                        <label class="form-check-label filter-indicator" style="background-color: ${filter.bgcolor}; opacity: ${filter.opacity}"></label>
                    </div>
                `);
            }
        });
        $('.form-check-input').on('change', function() {
            const layer = $(this).val();
            if (groups[layer]) {
                if ($(this).is(':checked')) {
                    map.addLayer(groups[layer]);
                } else {
                    if (map.hasLayer(groups[layer])) {
                        map.removeLayer(groups[layer]);
                    }
                }
            }
        });
    }

    renderLayerFilters();

    // pk.eyJ1IjoiYXpoYXJ5YXJsaWFuc3lhaCIsImEiOiJjbDI4N3F0YnowNmxlM2NwYWlsb3BwZWFpIn0.dB7uA6TXU4CdKV4M1z4PfQ
    // sk.eyJ1IjoiYXpoYXJ5YXJsaWFuc3lhaCIsImEiOiJjbDI4N3gwcTYwNHViM2tvODhrcmtwM2hqIn0.0_-Mi2gg5uPtKwy3v0dBLA
    const coord = [-5.655118, 132.741714];
    const map = L.map('map').setView(coord, 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYXpoYXJ5YXJsaWFuc3lhaCIsImEiOiJjbDI4N3F0YnowNmxlM2NwYWlsb3BwZWFpIn0.dB7uA6TXU4CdKV4M1z4PfQ'
    }).addTo(map);

    map.createPane('fixed', document.getElementById('map'));

    let groups = {};

    function addCircleCoordinate(coord, radius, color, label, group) {
        const marker = L.marker(coord);
        const circle = L.circle(coord, {
            color: 'transparent',
            fillColor: color,
            fillOpacity: 0.5,
            radius: radius
        }).addTo(map);
        if (!groups[group]) {
            groups[group] = L.layerGroup();
        }

        const popup = L.popup({
            pane: 'fixed',
            className: 'popup-fixed',
            autoPan: false,
        }).setContent(`
            <strong>${label}</strong> (${group})
        `);
        marker.bindPopup(popup);

        marker.addTo(groups[group]);
        circle.addTo(groups[group]);
    }

    addCircleCoordinate(coord, 500, '#92949D', 'Lokasi Z', 'menara_combat');

    // Lat : 5°34'0.66"S
    // Long : 133° 1'36.76"E
    // https://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values
    const data = [
        {
            label: 'Lokasi A',
            coord: [-5.654133, 132.747773],
            color: '#FF5050',
            radius: 400,
            group: 'menara_reguler_telkomsel'
        },
        {
            label: 'Lokasi B',
            coord: [-5.649283, 132.734625],
            color: '#28C27D',
            radius: 300,
            group: 'menara_non_3t_telkomsel'
        },
        {
            label: 'Lokasi C',
            coord: [-5.644433, 132.736888],
            color: '#FF5050',
            radius: 700,
            group: 'menara_reguler_telkomsel'
        },
    ];

    data.forEach((row) => addCircleCoordinate(row.coord, row.radius, row.color, row.label, row.group));
    Object.keys(groups).forEach((group) => groups[group].addTo(map));

    $('#search').on('keyup', function() {
        const q = $(this).val();
        if (q) {
            layerFilters.forEach((layer) => {
                if (layer.label.toLowerCase().indexOf(q) === -1) {
                    layer.shown = false;
                } else {
                    layer.shown = true;
                }
            });
        } else {
            layerFilters.forEach((layer) => layer.shown = true);
        }

        renderLayerFilters();
    });
});