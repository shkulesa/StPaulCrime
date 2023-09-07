<template>
    <div class="filter">
    <div class="cell auto">
      <button class="button" type="button" data-toggle="data-filter">Filter</button>
      <img class="legend" src="./assets/legend.png" alt="table legend" />
    </div>
      <div class="dropdown-pane form cell-auto" id="data-filter" data-dropdown data-auto-focus="true">
        <div class="grid-x" >
            <div class="small-10">
                <h4>Filter results</h4>
            </div>
            <div class="small-2">
                <button class="close-button" aria-label="Dismiss alert" type="button" data-toggle="data-filter">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        <form>
            <div class="grid-container">
                <div class="grid-x grid-padding-x">
                    <div class="cell small-6">
                        <h6>Neighborhood:</h6>
                        <template v-for="(value, key) in neighborhoods">
                            <input type="checkbox" :id=value :value=key v-model="settings.neighborhoods">
                            <label :for=value>{{value}}</label>
                            <br/>
                        </template>
                    </div>
                    <div class="cell small-6">
                        <h6>Incident Type:</h6>
                        <template v-for="(value, key) in type_groups">
                            <input type="checkbox" :id=key :value=key v-model="settings.types">
                            <label :for=key>{{key}}</label>
                            <br/>
                        </template>
                    </div>
                </div>
            </div>
            <h6>Timespan:</h6>
                <div class="grid-x">
                    <div class="small-3 margin-r">
                        Start: <input type="date" @change="showStartTime" v-model="settings.start_date">
                    </div>
                    <div class="small-3 margin-r">
                        End: <input type="date" @change="showEndTime" v-model="settings.end_date">
                    </div>
                </div>
                <div class="grid-x">
                    <div v-if="show_start_time" class="small-3 margin-r">
                        <input type="time" v-model="settings.start_time">
                    </div>
                    <div v-if="show_end_time" class="small-3 margin-r">
                        <input type="time" v-model="settings.end_time">
                    </div>
                </div>
             <h6>Max Incidents:</h6>
             <div class="grid-x">
                <div class="small-2">
                    <input required type="number" min="1" v-model="settings.limit">  
                </div>
            </div>
            <button type="button" class="button margin-r" @click="applyFilters">Apply Filters</button>
            <button type="button" class="button" @click="resetFilters">Reset Filters</button>
        </form>
      </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.data_filter = new Foundation.Dropdown($('#data-filter'), {
            vOffset: 5
        });
    },
    data() {
        return {
            API_BASE_URL: 'https://stpaulcrimeapi.onrender.com',
            settings: {
                types: [],
                neighborhoods: [],
                start_date: "",
                end_date: "",
                start_time: "00:00:00",
                end_time: "23:59:59",
                limit: ""
            },
            neighborhoods: {1:'Conway/Battlecreek/Highwood', 2:'Greater East Side', 3:'West Side', 4:'Daytons Bluff', 5:'Payne/Phalen',6:'North End',7:'Thomas/Dale(Frogtown)', 8:'Summit/University', 9:'West Seventh', 10:'Como', 11:'Hamline/Midway', 12:'St. Anthony', 13:'Union Park', 14:'Macalester-Groveland', 15:'Highland', 16:'Summit Hill', 17:'Capitol River'},
            type_groups: {
                "Murder": [100, 110, 120],
                "Rape" : [210, 220],
                "Robbery": [300, 311, 312, 313, 314, 321, 322, 323, 324, 331, 333, 334, 341, 342, 343, 344, 351, 352, 353, 354, 361, 363, 364, 371, 372, 373, 374],
                "Assault": [ 400, 410, 411, 412, 420, 421, 422, 430, 431, 432, 440, 441, 442, 450, 451, 452, 453, 810, 861, 862, 863],
                "Burglary": [500, 510, 511, 513, 515, 516, 520, 521, 523, 525, 526, 530, 531, 533, 535, 536, 540, 541, 543, 545, 546, 550, 551, 553, 555, 556, 560, 561, 563, 565, 566],
                "Theft": [600, 603, 611, 612, 613, 614, 621, 622, 623, 630, 631, 632, 633, 640, 641, 642, 643, 651, 652, 653, 661, 662, 663, 671, 672, 673, 681, 682, 683, 691, 692, 693],
                "Motor Vehicle Theft": [700, 710, 711, 712, 720, 721, 722, 730, 731, 732],
                "Arson": [900, 901, 903, 905, 911, 913, 915, 921, 922, 923, 925, 931, 933, 941, 942, 951, 961, 971, 972, 975, 981, 982],
                "Vandalism": [1400, 1401, 1410, 1415, 1416, 1420, 1425, 1426, 1430, 1435, 1436],
                "Narcotics": [1800, 1810, 1811, 1812, 1813, 1814, 1815, 1820, 1822, 1823, 1824, 1825, 1830, 1835, 1840, 1841, 1842, 1843, 1844, 1845, 1850, 1855, 1860, 1865, 1870, 1880, 1885],
                "Other": [2619, 3100, 9954, 9959, 9986]
            },
            show_start_time: false,
            show_end_time: false
        }
    },
    methods: {
        showStartTime() {
            this.show_start_time = true;
        },
        showEndTime() {
            this.show_end_time = true;
        },
        applyFilters() {
            if(this.settings.start_time.length < 6) this.settings.start_time += ":00";
            let time = true;
            if(this.settings.start_time == "00:00:00" && this.settings.end_time == "23:59:59")time = false;
            let url = this.generateURL();
            let test;
            if(time) {
                this.$parent.getJSON(url)
                .then((results) => {
                    test = this.filterTime(results, this.settings.start_time, this.settings.end_time);
                    console.log(test);
                    this.$parent.updateIncidents(test);
                })
                .catch((err) => {
                    console.log("Error retrieving data" + err);
                });
            } else {
                console.log("no time filter");
                this.$parent.getJSON(url)
                .then((results) => {
                    test = results;
                    console.log(test);
                    this.$parent.updateIncidents(test);
                })
                .catch((err) => {
                    console.log("Error retrieving data" + err);
                });
            }
            
        },
        generateURL() {
            let url = `${this.API_BASE_URL}/incidents?`;
            let firstParam = true;
            for(let i = 0; i < this.settings.types.length; i++) {
                if(i == 0) {
                    url += "code=";
                    firstParam = false;
                }
                for(let j = 0; j < this.type_groups[this.settings.types[i]].length; j++) {
                    if(i != 0 || j != 0) url += ",";
                    url += this.type_groups[this.settings.types[i]][j];
                }
            }
            for(let i = 0; i < this.settings.neighborhoods.length; i++) {
                if(i == 0) {
                    if(firstParam) {
                        url += "neighborhood=" + this.settings.neighborhoods[i];
                        firstParam = false;
                    } else {
                        url += "&neighborhood=" + this.settings.neighborhoods[i];
                    }
                } else {
                    url += "," + this.settings.neighborhoods[i];
                }
            }
            if(this.settings.start_date != undefined && this.settings.start_date != "") {
                let start = "";
                if(!firstParam) {
                    start = "&";
                }
                start += "start_date=" + this.settings.start_date + "T" + this.settings.start_time;
                url += start;
                firstParam = false;
            }
            if(this.settings.end_date != undefined && this.settings.end_date != "") {
                let end = "";
                if(!firstParam) {
                    end = "&";
                }
                end += "end_date=" + this.settings.end_date + "T" + this.settings.end_time;
                url += end;
                firstParam = false;
            }
            if(this.settings.limit != undefined && this.settings.limit != "" ){
                if(!firstParam) {
                    url += "&";
                }
                url += "limit="  + this.settings.limit;
            }
            // console.log('URL:' + url);
            //if no filters
            if(url.charAt(url.length-1) == '?') url = url.substring(0,url.length-1);
            return url;
        },
        filterTime(data, start, end) {
            let filtered = [];
            let idx = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].time >= start && data[i].time <= end) {
                    filtered[idx++] = data[i];
                }
            }
            return filtered;
        },
        resetFilters() {
            this.settings.types = [],
            this.settings.neighborhoods = [],
            this.settings.start_date = "",
            this.settings.end_date = "",
            this.settings.start_time = "00:00:00",
            this.settings.end_time = "23:59:59",
            this.settings.limit = ""
        }
    }
}
</script>

<style >
    .filter {
        margin-top: .5rem;
    }
    .form {
        width: 80%;
        margin: 1rem;
    }
    .margin-r {
        margin-right: 2.5%;
    }
    h6 {
        font-weight: bold;
    }
    .legend {
        position: relative;
        clear: right;
        left: 2 rem;
    }
</style>