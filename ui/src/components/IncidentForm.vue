<script>
    export default {
        props: {
            sendForm: Function
        },
        data() {
            return {
                API_BASE_URL: 'https://stpaulcrimeapi.onrender.com',
                data: {
                    case_number: 22900010,
                    date: "",
                    time: "",
                    code: "",
                    incident: "",
                    police_grid: "",
                    neighborhood_number: "",
                    block: ""
                },
                success: false,
                types: {
                    "100":"HOMICIDE",
                    "110":"Murder, Non Negligent Manslaughter",
                    "120":"Murder, Manslaughter By Negligence",
                    "210":"Rape, By Force",
                    "220":"Rape, Attempt",
                    "300":"Robbery",
                    "311":"Robbery, Highway, Firearm",
                    "312":"Robbery, Highway, Knife or Cutting Instrument",
                    "313":"Robbery, Highway, Other Dangerous Weapons",
                    "314":"Robbery, Highway, By Strong Arm",
                    "321":"Robbery, Commercial House, Firearm",
                    "322":"Robbery, Commercial House, Knife or Cutting Instrument",
                    "323":"Robbery, Commercial House, Other Dangerous Weapons",
                    "324":"Robbery, Commercial House, By Strong Arm",
                    "331":"Robbery, Service Station, Firearm",
                    "333":"Robbery, Service Station, Other Dangerous Weapons",
                    "334":"Robbery, Service Station, By Strong Arm",
                    "341":"Robbery, Convenience Store, Firearm",
                    "342":"Robbery, Convenience Store, Knife or Cutting Instrument",
                    "343":"Robbery, Convenience Store, Other Dangerous Weapons",
                    "344":"Robbery, Convenience Store, By Strong Arm",
                    "351":"Robbery, Residence, Firearm",
                    "352":"Robbery, Residence, Knife or Cutting Instrument",
                    "353":"Robbery, Residence, Other Dangerous Weapons",
                    "354":"Robbery, Residence, By Strong Arm",
                    "361":"Robbery, Bank, Firearm",
                    "363":"Robbery, Bank, Other Dangerous Weapons",
                    "364":"Robbery, Bank, By Strong Arm",
                    "371":"Robbery, Misc., Firearm",
                    "372":"Robbery, Misc., Knife or Cutting Instrument",
                    "373":"Robbery, Misc., Other Dangerous Weapons",
                    "374":"Robbery, Misc., By Strong Arm",
                    "400":"Aggravated Assault",
                    "410":"Aggravated Assault, Firearm",
                    "411":"Aggravated Assault, Domestic",
                    "412":"Aggravated Assault, Domestic",
                    "420":"Aggravated Assault, Knife or Cutting Instrument",
                    "421":"Aggravated Assault, Domestic",
                    "422":"Aggravated Assault, Domestic",
                    "430":"Aggravated Assault, Other Dangerous Weapons",
                    "431":"Aggravated Assault, Domestic",
                    "432":"Aggravated Assault, Domestic",
                    "440":"Aggravated Assault, Fists/Feet/Hands",
                    "441":"Aggravated Assault, Domestic",
                    "442":"Aggravated Assault, Domestic",
                    "450":"Aggravated Assault, Domestic",
                    "451":"Aggravated Assault, Domestic",
                    "452":"Aggravated Assault, Domestic",
                    "453":"Aggravated Assault, Domestic",
                    "500":"Burglary",
                    "510":"Burglary, Forced Entry, Night, Residence",
                    "511":"Burglary, Forced Entry, Night, Residence, Occupied",
                    "513":"Burglary, Forced Entry, Night, Garage",
                    "515":"Burglary, Forced Entry, Night, Commercial",
                    "516":"Burglary, Forced Entry, Night, Commercial, Occupied",
                    "520":"Burglary, No Forced Entry, Night, Residence",
                    "521":"Burglary, No Forced Entry, Night, Residence, Occupied",
                    "523":"Burglary, No Forced Entry, Night, Garage",
                    "525":"Burglary, No Forced Entry, Night, Commercial",
                    "526":"Burglary, No Forced Entry, Night, Commercial, Occupied",
                    "530":"Burglary, Forced Entry, Day, Residence",
                    "531":"Burglary, Forced Entry, Day, Residence, Occupied",
                    "533":"Burglary, Forced Entry, Day, Garage",
                    "535":"Burglary, Forced Entry, Day, Commercial",
                    "536":"Burglary, Forced Entry, Day, Commercial, Occupied",
                    "540":"Burglary, No Forced Entry, Day, Residence",
                    "541":"Burglary, No Forced Entry, Day, Residence, Occupied",
                    "543":"Burglary, No Forced Entry, Day, Garage",
                    "545":"Burglary, No Forced Entry, Day, Commercial",
                    "546":"Burglary, No Forced Entry, Day, Commercial, Occupied",
                    "550":"Att. Burglary, Forced Entry, Night, Residence",
                    "551":"Att. Burglary, Forced Entry, Night, Residence, Occupied",
                    "553":"Att. Burglary, Forced Entry, Night, Garage",
                    "555":"Att. Burglary, Forced Entry, Night, Commercial",
                    "556":"Att. Burglary, Forced Entry, Night, Commercial, Occupied",
                    "560":"Att. Burglary, Forced Entry, Day, Residence",
                    "561":"Att. Burglary, Forced Entry, Day, Residence, Occupied",
                    "563":"Att. Burglary, Forced Entry, Day, Garage",
                    "565":"Att. Burglary, Forced Entry, Day, Commercial",
                    "566":"Att. Burglary, Forced Entry, Day, Commercial, Occupied",
                    "600":"Theft, Except Auto Theft",
                    "603":"Theft - Mail/Package",
                    "611":"Theft, Pocket Picking, Under $500",
                    "612":"Theft, Pocket Picking, $501 to $1000",
                    "613":"Theft, Pocket Picking, Over $1000",
                    "614":"Other",
                    "621":"Theft, Purse Snatching, Under $500",
                    "622":"Theft, Purse Snatching, $501 to $1000",
                    "623":"Theft, Purse Snatching, Over $1000",
                    "630":"Theft, Shoplifting",
                    "631":"Theft, Shoplifting, Under $500",
                    "632":"Theft, Shoplifting, $501 to $1000",
                    "633":"Theft, Shoplifting, Over $1000",
                    "640":"Theft, From Auto",
                    "641":"Theft, From Auto, Under $500",
                    "642":"Theft, From Auto, $501 to $1000",
                    "643":"Theft, From Auto, Over $1000",
                    "651":"Theft, Auto Accessories, Under $500",
                    "652":"Theft, Auto Accessories, $501 to $1000",
                    "653":"Theft, Auto Accessories, Over $1000",
                    "661":"Theft, Bicycle Theft, Under $500",
                    "662":"Theft, Bicycle Theft, $501 to $1000",
                    "663":"Theft, Bicycle Theft, Over $1000",
                    "671":"Theft, From Building, Under $500",
                    "672":"Theft, From Building, $501 to $1000",
                    "673":"Theft, From Building, Over $1000",
                    "681":"Theft, From Coin Operated Device, Under $500",
                    "682":"Theft, From Coin Operated Device, $501 to $1000",
                    "683":"Theft, From Coin Operated Device, Over $1000",
                    "691":"Theft, All Other, Under $500",
                    "692":"Theft, All Other, $501 to $1000",
                    "693":"Theft, All Other, Over $1000",
                    "700":"Motor Vehicle Theft",
                    "710":"Motor Vehicle Theft, Automobile",
                    "711":"Motor Vehicle Theft, Trucks and Buses",
                    "712":"Motor Vehicle Theft, All Other Vehicles",
                    "720":"Att. Motor Vehicle Theft, Automobile",
                    "721":"Att. Motor Vehicle Theft, Trucks and Buses",
                    "722":"Att. Motor Vehicle Theft, All Other Vehicles",
                    "730":"AUTO THEFT-OOC,STOLEN RECOVERED,AUTOMOBILES",
                    "731":"AUTO THEFT-OOC,STOLEN RECOVERED,TRUCKS & BUSES",
                    "732":"AUTO THEFT-OOC,STOLEN RECOVERED,ALL OTHER VEHICLES",
                    "810":"Asasult, Domestic",
                    "861":"Assault, Domestic, Opposite Sex",
                    "862":"Assault, Domestic, Family/Child",
                    "863":"Assault, Domestic, Gross Misdemeanor",
                    "900":"Arson",
                    "901":"Arson, Residential, Single Occupancy, Endangering Life",
                    "903":"Arson, Residential, Single Occupancy, Other",
                    "905":"Arson, Residential, Single, Abandoned, Other",
                    "911":"Arson, Residential, Multiple Occupancy, Endangering Life",
                    "913":"Arson, Residential, Multiple Occupancy, Other",
                    "915":"Arson, Residential, Multiple, Abandoned, Other",
                    "921":"Arson, Commercial, Indust/Manu, Endangering Life",
                    "922":"Arson, Commercial, Indust/Manu, Defraud Insurer",
                    "923":"Arson, Commercial, Indust/Manu, Other",
                    "925":"Arson, Commercial, Indust/Manu, Other",
                    "931":"Arson, Other Commercial, Endangering Life",
                    "933":"Arson, Other Commercial, Other",
                    "941":"Arson, Community Building, Endangering Life",
                    "942":"Arson, Community Building, Other",
                    "951":"Arson, Storage Building",
                    "961":"Arson, All Other Structures",
                    "971":"Arson, Motor Vehicle",
                    "972":"Arson, Motor Vehicle, Abandoned",
                    "975":"Arson, Other Mobile Property",
                    "981":"Arson, Not Structure",
                    "982":"Arson, Not Structure, Abandoned",
                    "1400":"Criminal Damage to Property",
                    "1401":"Graffiti",
                    "1410":"Criminal Damage to Property (Misdemeanor, Under $250)",
                    "1415":"Graffiti (Misdemeanor, Under $250)",
                    "1416":"Graffiti-Gang (Misdemeanor, Under $250)",
                    "1420":"Criminal Damage to Property (Gross Mis., $250-$500)",
                    "1425":"Graffiti (Gross Mis., $250-$500)",
                    "1426":"Graffiti-Gang (Gross Mis., $250-$500)",
                    "1430":"Criminal Damage to Property (Felony, Over $500)",
                    "1435":"Graffiti (Felony, Over $500)",
                    "1436":"Graffiti-Gang (Felony, Over $500)",
                    "1800":"Narcotics",
                    "1810":"Narcotics, Possession of Opium or Cocaine",
                    "1811":"Narcotics, Possession of Cocaine",
                    "1812":"Narcotics, Possession of Heroin",
                    "1813":"Narcotics, Possession of Methamphetamine",
                    "1814":"Narcotics, Possession of MDMA (Ecstasy)",
                    "1815":"Narcotics, Possession With Intent to Sell Cocaine",
                    "1820":"Narcotics, Possession of Synthetic Narcotic, Demerol, Etc.",
                    "1822":"Narcotics, Possession With Intent to Sell Heroin",
                    "1823":"Narcotics, Possession With Intent to Sell Methamphetamine",
                    "1824":"Narcotics, Possession With Intent to Sell MDMA (Ecstasy)",
                    "1825":"Narcotics, Possession With Intent to Sell Synthetics",
                    "1830":"Narcotics, Possession of Dangerous Non-Narcotic Drugs",
                    "1835":"Narcotics, Possession of Marijuana",
                    "1840":"Narcotics, Selling Opium, Cocaine, Etc.",
                    "1841":"Narcotics, Selling Cocaine",
                    "1842":"Narcotics, Selling Heroin",
                    "1843":"Narcotics, Selling Methamphetamine",
                    "1844":"Narcotics, Selling MDMA (Ecstasy)",
                    "1845":"Narcotics, Possession With Intent to Sell Non-Narcotics",
                    "1850":"Narcotics, Selling Synthetic Narcotics",
                    "1855":"Narcotics, Possession With Intent to Sell Marijuana",
                    "1860":"Narcotics, Selling Dangerous Non-Narcotics",
                    "1865":"Narcotics, Selling Marijuana",
                    "1870":"Narcotics, Possession of Inhalants",
                    "1880":"Narcotics, Possession of Narcotic Paraphernalia",
                    "1885":"Narcotics, Loitering With Intent to Sell Narcotics",
                    "2619":"Weapons, Discharging a Firearm in the City Limits",
                    "3100":"DEATH-INVESTIGATION OF A DEATH",
                    "9954":"Proactive Police Visit",
                    "9959":"Community Engagement Event",
                    "9986":"Proactive Foot Patrol"
                },
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
                }
            }
        },
        methods: {
            getDate() {
                let date = new Date();
                return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            },
            validateRequest() {
                if(this.data.code == undefined || this.data.date == undefined || this.data.police_grid == undefined || this.data.neighborhood_number == undefined || this.data.block == undefined) {
                    console.log('code: ' + this.data.code + ' date: ' + this.data.date + ' police_grid: ' + this.data.police_grid + ' neighborhood: ' + this.data.neighborhood_number + ' block: ' + this.data.block);
                    return false;
                }
                return true;
            },
            sendRequest() {
                if (this.validateRequest()) {
                    //send req
                    this.data.time = new Date().toLocaleTimeString('en-US',{hour12:false});
                    this.data.incident = this.types[this.data.code];
                    console.log(this.data);
                    this.sendForm("PUT", `${this.API_BASE_URL}/new-incident`, this.data)
                    .then((suc) => {
                        this.success = true;
                        console.log("success: " + suc);
                    })
                    .catch((err) => {
                        console.log(err.status + " err: " + err.message);
                        if(err.status == 500) {
                            window.alert("Error: case number already exists");
                        }
                    })
                } else {
                    console.log("FORM ERR");
                    window.alert("Please fill out the whole form");
                }
            },
            removeBadge() {
                this.success = false;
            }
        }
    }

</script>


<template>
    <div class="form" @change="removeBadge">
        <h4 v-show="success" :key="success" class="green-font">Form submitted successfully &#10003;</h4>
        <form @submit.prevent="sendRequest">
            <label>Case Number</label>
            <input type="number" v-model="data.case_number" required>
            <label>Code</label>
            <select id="code" name="code" v-model="data.code" required>
                <option v-for="(key, value) in types" :value=value>{{key}}</option>
            </select>
            <label>Date</label>
            <input type="date" id="date" v-model="data.date" required>
            <label>Police Grid</label>
            <input type="text" id="police_grid" v-model="data.police_grid" placeholder="Enter Police Grid" required>
            <label>Neighborhood</label>
            <select id="neighborhood_number" name="neighborhood_number" v-model="data.neighborhood_number" required>
                <option v-for="(key, value) in neighborhoods" :value="value">{{key.name}}</option>
            </select>
            <label>Address</label>
            <input type="text" id="block" v-model="data.block" placeholder="Enter Address" required>
            <button type="submit" class="button">Submit  <span v-show="success" class="badge success" :key="success">&#10003;</span></button>
        </form>
    </div>
</template>

<style>
    .form {
        margin: 3rem;
    }
    .green-font {
        color: lightgreen;
    }
</style>