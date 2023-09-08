<script>
import $ from 'jquery'
import IncidentForm from './components/IncidentForm.vue'
import DataFilter from './components/DataFilter/DataFilter.vue'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default {
    components: { IncidentForm, DataFilter },
    data() {
        return {
            view: 'map',
            codes: [],
            neighborhoods: {
                1: {name: 'Conway/Battlecreek/Highwood', loc: [44.942068, -93.020521]},
                2: {name: 'Greater East Side', loc: [44.977413, -93.025156]},
                3: {name: 'West Side', loc: [44.931244, -93.079578]},
                4: {name: 'Daytons Bluff', loc: [44.956192, -93.060189]},
                5: {name: 'Payne/Phalen', loc: [44.978883, -93.068163]},
                6: {name: 'North End', loc: [44.975766, -93.113887]},
                7: {name: 'Thomas/Dale(Frogtown)', loc: [44.959639, -93.121271]},
                8: {name: 'Summit/University', loc: [44.947700, -93.128505]},
                9: {name: 'West Seventh', loc: [44.930276, -93.119911]},
                10: {name: 'Como', loc: [44.982752, -93.147910]},
                11: {name: 'Hamline/Midway', loc: [44.963631, -93.167548]},
                12: {name: 'St. Anthony', loc: [44.973971, -93.197965]},
                13: {name: 'Union Park', loc: [44.949043, -93.178261]},
                14: {name: 'Macalester-Groveland', loc: [44.934848, -93.176736]},
                15: {name: 'Highland', loc: [44.913106, -93.170779]},
                16: {name: 'Summit Hill', loc:[44.937705, -93.136997]},
                17: {name: 'Capitol River', loc:[44.949203, -93.093739]}
            },
            isLoading: true,
            renderIncidents: 0,
            incidents: [],
            visibleIncidents: [],
            leaflet: {
                map: null,
                center: {
                    lat: 44.955139,
                    lng: -93.102222,
                    address: ""
                },
                zoom: 12,
                bounds: {
                    nw: {lat: 45.008206, lng: -93.217977},
                    se: {lat: 44.883658, lng: -92.993787}
                },
                neighborhood_markers: [
                    {location: [44.942068, -93.020521], marker: null, neighborhood_name:'Conway/Battlecreek/Highwood'},
                    {location: [44.977413, -93.025156], marker: null, neighborhood_name:'Greater East Side'},
                    {location: [44.931244, -93.079578], marker: null, neighborhood_name:'West Side'},
                    {location: [44.956192, -93.060189], marker: null, neighborhood_name:'Daytons Bluff'},
                    {location: [44.978883, -93.068163], marker: null, neighborhood_name:'Payne/Phalen'},
                    {location: [44.975766, -93.113887], marker: null, neighborhood_name:'North End'},
                    {location: [44.959639, -93.121271], marker: null, neighborhood_name:'Thomas/Dale(Frogtown)'},
                    {location: [44.947700, -93.128505], marker: null, neighborhood_name:'Summit/University'},
                    {location: [44.930276, -93.119911], marker: null, neighborhood_name:'West Seventh'},
                    {location: [44.982752, -93.147910], marker: null, neighborhood_name:'Como'},
                    {location: [44.963631, -93.167548], marker: null, neighborhood_name:'Hamline/Midway'},
                    {location: [44.973971, -93.197965], marker: null, neighborhood_name:'St. Anthony'},
                    {location: [44.949043, -93.178261], marker: null, neighborhood_name:'Union Park'},
                    {location: [44.934848, -93.176736], marker: null, neighborhood_name:'Macalester-Groveland'},
                    {location: [44.913106, -93.170779], marker: null, neighborhood_name:'Highland'},
                    {location: [44.937705, -93.136997], marker: null, neighborhood_name:'Summit Hill'},
                    {location: [44.949203, -93.093739], marker: null, neighborhood_name:'Capitol River'}
                ]
            },
            currentAddress: '',
            currentMarker: null,
            inputError: false,
            currentBoundingBox: {},
            markerGroup: null,
        };
    },
    methods: {
        viewMap(event) {
            this.view = 'map';
        },

        viewNewIncident(event) {
            this.view = 'new_incident';
        },

        viewAbout(event) {
            this.view = 'about';
        },

        getJSON(url) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    dataType: 'json',
                    url: url,
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        reject({status: status.status, message: status.statusText});
                    }
                });
            });
        },
        uploadJSON(method, url, data) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: method,
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'text',
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        reject({status: status.status, message: status.statusText});
                    }
                });
            });
        },
        isInBoundingBox(lat, lon) {
            return lat >= this.leaflet.bounds.se.lat && lat <= this.leaflet.bounds.nw.lat && lon >= this.leaflet.bounds.nw.lng && lon <= this.leaflet.bounds.se.lng;
        },
        isInBounds(lat, lon, currentBounds) {
            var ne = currentBounds._northEast;
            var sw = currentBounds._southWest;
            return lat >= sw.lat && lat <= ne.lat && lon >= sw.lng && lon <= ne.lng;
        },
        onInput(e) {
            this.currentAddress = e.target.value;
        },
        onSubmit() {
            this.leaflet.map.removeLayer(this.currentMarker);
            this.inputError = false;
            this.getJSON(`https://nominatim.openstreetmap.org/search?q=${encodeURI(this.currentAddress)}&format=json`).then((result) => {
                if(result.length !== 0) {
                    const {lat, lon, display_name} = result[0];
                    if(this.isInBoundingBox(lat, lon)) {
                        this.currentMarker = L.marker([lat, lon]).addTo(this.leaflet.map).bindPopup(`<h4>${display_name}</h4>`);
                        this.leaflet.map.panTo([lat, lon]);
                    } else {
                        this.inputError = true;
                    }
                } else {
                    this.inputError = true;
                }
            }).catch((error) => {
                console.log(error);
            })
        },
        onInteract() {
            this.inputError = false;
            const currentCenter = this.leaflet.map.getCenter().lat + ',' + this.leaflet.map.getCenter().lng;
            this.getJSON('https://nominatim.openstreetmap.org/search?q=' + currentCenter + '&format=json').then((result) => {
                this.currentAddress = result[0].display_name;
            }).catch((error) => {
                console.log(error);
            });
            // this.getJSON(`${this.API_BASE_URL}/incidents`).then((results) => {
            // results.sort((inc1,inc2) => new Date(inc2.date_time) - new Date(inc1.date_time));
            // const visibleNeighborhoods = Object.values(this.neighborhoods).filter((each) => this.isInBounds(each.loc[0], each.loc[1], this.leaflet.map.getBounds())).map((each) => each.name);
            // this.incidents = results.filter((incident) => {
            //     return visibleNeighborhoods.includes(this.neighborhoods[incident.neighborhood_number].name);
            // });
            this.isLoading = true;
            if(this.incidents.length > 0) {
                let results = this.incidents.sort((inc1,inc2) => new Date(inc2.date_time) - new Date(inc1.date_time));
                const visibleNeighborhoods = Object.values(this.neighborhoods).filter((each) => this.isInBounds(each.loc[0], each.loc[1], this.leaflet.map.getBounds())).map((each) => each.name);
                this.visibleIncidents = results.filter((incident) => {
                    return visibleNeighborhoods.includes(this.neighborhoods[incident.neighborhood_number].name);
                });
                this.isLoading = false;
            }
        // }).catch((error) => {
        //     console.log('Error', error);
        // });
        },
        updateIncidents(results) {
            this.visibleIncidents = results;
            this.renderIncidents++;
            this.isLoading = false;
        },
        onDelete(item) {
            this.uploadJSON('DELETE', `${API_BASE_URL}/remove-incident`, {'case_number': item.case_number}).then((result) => {
                this.visibleIncidents = this.visibleIncidents.filter((incident) => incident.case_number !== item.case_number);
            }).catch((error) => {
                console.log(error);
            })
        },
        displayMarker(item) {
            this.inputError = false;    
            var block = item.block;
            block = block.split(' ');
            block[0] = block[0].replaceAll('X', '0');
            block = block.join(' ') + ', Saint Paul, Minnesota, US';
            this.getJSON(`https://nominatim.openstreetmap.org/search?q=${encodeURI(block)}&format=json`).then((result) => {
                if(result.length !== 0) {
                    const {lat, lon} = result[0];
                    if(this.isInBoundingBox(lat, lon)) {
                        var currentSelectionMarker = L.marker([lat, lon]).addTo(this.markerGroup);
                        var popup = document.createElement('div');
                        popup.innerHTML = `
                            <p>Incident: ${item.incident}<p>
                            <p>Date: ${item.date}<p>
                            <p>Time: ${item.time}<p>
                        `;
                        var button = document.createElement('button');
                        button.innerText = 'Delete Mark';
                        button.className = 'button';
                        button.addEventListener('click', () => {
                            this.markerGroup.removeLayer(currentSelectionMarker);
                            currentSelectionMarker.remove();
                        })
                        popup.appendChild(button);
                        currentSelectionMarker.bindPopup(popup);
                        currentSelectionMarker._icon.classList.add("huechange1");
                        this.leaflet.map.panTo([lat, lon]);
                    } else {
                        this.inputError = true;
                    }
                } else {
                    this.inputError = true;
                }
            }).catch((error) => {
                console.log(error);
                console.log(this.inputError);
            })
        },
        getCrimeType(item) {
            let code = Number.parseInt(item.code);
            if(code <= 220 || (code >=400 && code <=453) || (code >= 810 && code <= 863)) return "violent";
            if(code >= 1800) return "other";
            return "property";
        }
    },
    mounted() {
        this.leaflet.map = L.map('leafletmap').setView([this.leaflet.center.lat, this.leaflet.center.lng], this.leaflet.zoom);

        this.currentMarker = L.marker([this.leaflet.center.lat, this.leaflet.center.lng]).addTo(this.leaflet.map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 11,
            maxZoom: 18
        }).addTo(this.leaflet.map);
        this.leaflet.map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

        this.leaflet.map.on('zoomend', this.onInteract);
        this.leaflet.map.on('moveend', this.onInteract);

        this.markerGroup = L.layerGroup().addTo(this.leaflet.map);

        //Fix leaflet error when zoom after close popup in lightning component
        L.Popup.prototype._animateZoom = function (e) {
            if (!this._map) {
                return
            }
            var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
                anchor = this._getAnchor()
            L.DomUtil.setPosition(this._container, pos.add(anchor))
        }

        let district_boundary = new L.geoJson();
        district_boundary.addTo(this.leaflet.map);

        this.getJSON('/data/StPaulDistrictCouncil.geojson').then((result) => {
            // St. Paul GeoJSON
            $(result.features).each((key, value) => {
                district_boundary.addData(value);
            });
        }).catch((error) => {
            console.log('Error:', error);
        });
        
        this.getJSON(`${API_BASE_URL}/incidents`).then((results) => {
            // crime data
            // console.log(this.incidents);
            this.incidents = results;
            this.visibleIncidents = [...results];
            this.isLoading = false;
            const crimesByNeighborhood = this.incidents.reduce((total, value) => {
                total[this.neighborhoods[value.neighborhood_number].name] = (total[this.neighborhoods[value.neighborhood_number].name] || 0) + 1;
                return total;
            }, {});
            this.leaflet.neighborhood_markers.forEach((neighborhood) => {
                neighborhood.marker = L.marker(neighborhood.location).bindPopup(`<h4>Number of crimes: ${crimesByNeighborhood[neighborhood.neighborhood_name]}</h4>`).openPopup().addTo(this.leaflet.map);
                neighborhood.marker._icon.classList.add("huechange");
            });
        }).catch((error) => {
            console.log('Error', error);
        });
        $(".leaflet-pane.leaflet-shadow-pane").remove();
    }
}
</script>

<template>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <p :class="'cell small-4 ' + ((view === 'map') ? 'selected' : 'unselected')" @click="viewMap">Map</p>
            <p :class="'cell small-4 ' + ((view === 'new_incident') ? 'selected' : 'unselected')" @click="viewNewIncident">New Incident</p>
            <p :class="'cell small-4 ' + ((view === 'about') ? 'selected' : 'unselected')" @click="viewAbout">About</p>
        </div>
    </div>
    <div v-show="view === 'map'">
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <form @submit.prevent="onSubmit" class="cell auto" style="padding: 0;" data-abide>
                    <div v-show="inputError === true" data-abide-error class="alert callout" aria-live="assertive" role="alert" style="display: block;">
                        <p><i class="fi-alert"></i>Location is either invalid or not in bound.</p>
                    </div>
                    <div class="input-group">
                    <input :value="currentAddress" @input="onInput" class="input-group-field" type="text" placeholder="Search by Location">
                    <div class="input-group-button">
                        <input type="submit" class="button" value="Go">
                    </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-show="view === 'map'">
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <div id="leafletmap" class="cell auto"></div>
            </div>
        </div>
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <DataFilter />
            </div>
        </div>
    </div>
    <div v-show="view === 'map'">
        <div class="grid-container" :key="renderIncidents">
            <div class="grid-x grid-padding-x">
                <table class="hover unstriped">
                    <thead>
                        <tr>
                            <th>Case #</th>
                            <th>Incident Type</th>
                            <th>Neighborhood</th>
                            <th>Block</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="7">Loading...</td>
                        </tr>
                        <tr v-for="item in visibleIncidents" :class="getCrimeType(item)">
                            <td>{{ item.case_number }}</td>
                            <td>{{ item.incident}}</td>
                            <td>{{ neighborhoods[item.neighborhood_number].name }}</td>
                            <td>{{ item.block }}</td>
                            <td>{{ item.date }}</td>
                            <td> 
                                <div class="input-group-button">
                                    <button type="button" class="button" @click="displayMarker(item)">Show</button>
                                </div>
                            </td>
                            <td>
                                <div class="input-group-button">
                                    <button @click="onDelete(item)" class="button">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-if="view === 'new_incident'">
        <!-- Replace this with your actual form: can be done here or by making a new component -->
        <div class="grid-x grid-padding-x">
            <h1 class="cell auto">Submit a new Incident</h1>
        </div>
        <IncidentForm :sendForm="uploadJSON" />
        <div class="grid-container">
        </div>
    </div>
    <div v-if="view === 'about'">
        <!-- Replace this with your actual about the project content: can be done here or by making a new component -->
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <h1 class="cell auto">About the Project:</h1>
            </div>
            <h2>Our team...</h2>
            <div class="grid-x grid-margin-x grid-padding-y small-up-1 medium-up-2">
                <div class = "cell auto">
                    <h3>Sam</h3>
                    <ul> 
                        <li>Hometown: Minneapolis, MN</li>
                        <li>Collegiate Year: Senior</li>
                        <li>Major: Computer Science</li>
                        <li>Fun fact: I play on the UST Baseball team</li>
                    </ul>
                </div>
                <div class = "cell shrink">
                    <div class = "responsive-embed(1)">
                        <img src = "./images/samPic.jpg" alt = "Sam's Picture"/>
                    </div>
                </div>
            </div>

            <div class="grid-x grid-margin-x grid-padding-y small-up-1 medium-up-2">
                <div class = "cell auto">
                    <h3>Chris</h3>
                    <ul> 
                        <li>Hometown: Rogers, MN</li>
                        <li>Collegiate Year: Junior</li>
                        <li>Major: Computer Science</li>
                        <li>Fun fact: I have gone to the Minnesota State Fair every year I have been alive</li>
                    </ul>
                </div>
                <div class = "cell shrink responsive-embed(1)">
                    <img src = "./images/chrisPic.jpg" alt = "Chris' Picture"/>
                </div>
            </div>

            <div class="grid-x grid-margin-x grid-padding-y small-up-1 medium-up-2">
                <div class = "cell auto">
                    <h3>Hieu</h3>
                    <ul> 
                        <li>Hometown: Danang, Vietnam</li>
                        <li>Collegiate Year: Senior</li>
                        <li>Major: Computer Science</li>
                        <li>Fun fact: I play guitar in my free time</li>
                    </ul>
                </div>
                <div class = "cell shrink responsive-embed(1)">
                    <img src = "./images/hieuPic.jpeg" alt = "Hieu's Picture"/>
                </div>
            </div>

            <h2>What we used...</h2>
            <h4>APIs:</h4>
            <ul>
                <li><a href = "https://leafletjs.com/" target = "_blank">Leaflet</a>: We used Leaflet to render the interactive map and place neighborhood markers on top of it to see crimes of that area.</li>
                <li><a href = "https://nominatim.org/release-docs/develop/api/Overview/" target = "_blank">Nominatim</a>: We used Nominatim to convert between address and lat/lon.</li>
                <li>Saint Paul Crime: We built and used our own API which interacts with the data stored in a SQLite3 database, originally downloaded from the public <a href = "https://information.stpaul.gov/datasets/stpaul::crime-incident-report/about" target = "_blank">Saint Paul Crime Incident Report </a>dataset.
                    We built this API using Node.Js and JQuery.
                </li>
            </ul>
            <h4>Frameworks:</h4>
            <ul>
                <li><a href = "https://vuejs.org/" target = "_blank">Vue.js</a>:
                    We used Vue because it is a lightweight and relatively simple JavaScript framework which is commonly used for single page applications such as ours.
                    It gave us the ability to create components for data filtering and the incident form and overall made our code simpler and more readable.
                </li>
                <li><a href = "https://get.foundation/" target = "_blank">Foundations</a>:
                    We used Foundations because it is an advanced responsive front-end framework which we are all familar with.
                    This allows our appliation to be used on any size screen.
                </li>
                <li><a href = "https://expressjs.com/" target = "_blank">Express</a>:
                    We used Express as a back end framework for building our Saint Paul Crime API.
                </li>
            </ul>

            <h2>Our findings...</h2>
            <ul>
                <li>UST is split between the nieghborhoods Union Park and Macalester-Groveland.
                    During the previous school year, there was one murder in these neighborhoods (01/11/2022).
                </li>
                <li>In these two neighborhoods there were 22 robberies during our last school year.</li>
                <li>There were 0 reports of arson in any of the Saint Paul neighborhoods during the previous school year.</li>
                <li>107 out of the 1000 most recent crime incidents have occured in the Capitol River neighborhood (Downtown Saint Paul).</li>
                <li>4 out of the 10 most recent murders occured in the Payne/Phalen neighborhood.</li>
                <li>The Como neighborhood had the least crime incidents out of the last 1000 with only 21.</li>
            </ul>

            <h2>Demo Video:</h2>
            <div class = "responsive-embed">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/V92aN5nZBtw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <!--insert video here-->
            </div>
        </div>
    </div>
</template>

<style>
#leafletmap {
    height: 500px;
}

.selected {
    background-color: rgb(10, 100, 126);
    color: white;
    border: solid 1px white;
    text-align: center;
    cursor: pointer;
}
.unselected {
    background-color: rgb(200, 200, 200);
    color: black;
    border: solid 1px white;
    text-align: center;
    cursor: pointer;
}
img.huechange { 
    filter: hue-rotate(120deg); 
}
img.huechange1 { 
    filter: hue-rotate(230deg); 
}
</style>
