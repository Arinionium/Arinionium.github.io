# FEATHER-WEATHER

## 1. Overwiev
Small two page VueJs project build with use of Vue CLI, Vue router. Main purpose of the application is to obtain weather data for the city specified by the user. 
It is possible to create up to 5 weather cards, and if necessary, save them to favorites (also limit to 5). Data presented with linear charts (with use of ChartJs).

## 2. Project setup and commands
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
## 3. Folder structure

### src/assets
Contains images, animated svgs. In src/assets/css placed global styles (nullifying styles for standart html tags and etc).

### src/components 
Contains all main Vue SFC (single-file-component) files.
src/components/Weather contains main files for app.
src/components/Common contains files of inputs, modals, spinners and etc.

### src/pages
Contains routed with Vue router components.

### src/router
Contains index.js for routing with Vue router.

## 4. Components
Common/AddToChosen - component with buttons to add card to chosen (logic for removing was not implemented, but you still can delete them on Chosen Page). Logic for adding to chosen placed in CitySearchInput.vue.

Common/AppHeader - app's header with logo, title and router-link's to pages.

Common/LoadingSpinner - component for displaying spinner loader.

Common/CustomModal - custom modal made to display modals (implemented through slots and this.$parent.$on(..., ...)).

Common/CitySearchInput - contains logic for: autocomplete input (initialy implemented with Geonames API but later was changed to GeoDB API), adding to chosen, getting weather data on request. For getting weather from city uses Openweathermap API.

### DUE TO BEING FREE GeoDB API ACCEPTS ONLY ONE REQUEST IN SECOND.

## Because Openweathermap API also free it gives you only data for current weather which not suitable for Charts. So 5 days Openweather API where used which gives you data about changes in weather every 3 hours for next five days. Data for one day was filtered and used as data for displaying Day weather. Another issue that it gives you data from current moment SO IF YOU USING IT LATE IN EVENING day Charts can have only one point. To display FIVE days Charts data were reduced to average for day.

____________________________________________________________________________

Weather/WeatherDisplay - displays charts and tables of weather data. Contains logic for manipulating data for showing and switching view between Day and 5 day (Week).
Weather/WeatherComponent - component for displaying other components together. Also contains logic for deleting weather cards. 
Also has logic for displaying first component on page with weather based on users current place.

pages/WeatherPage - component for Home page. Contains logic for adding new weather cards and deleting them.
pages/WeatherChosen - component for Chosen page. Almost same as previous just for Chosen page.

## 5. API interactions
Geonames API - initialy used for city's input autocomplete (city search dropdown with propositions for autocomplete). Endpoints base url: http://api.geonames.org/searchJSON . Based on passed params returns number(based on params) of locations with similar names. https://www.geonames.org/

GeoDB API - used for city's input autocomplete (city search dropdown with propositions for autocomplete). Endpoints base url: https://wft-geo-db.p.rapidapi.com/v1/geo/cities . Based on passed params for request returns 5 cities with similar names. https://rapidapi.com/wirefreethought/api/geodb-cities
## GeoDB has limit on requests in short period of time so when typing fast in input can give errors.

Ipinfo API - used to get data about current place of App user to display first weather card based on his\her location. Endpoints base url: https://ipinfo.io .

Openweathermap API - used for getting weather data. Endpoint base url: https://api.openweathermap.org/data/2.5/forecast . 5 days Forcast API was used because it's only free API (among Openweather APIs) with which you can get more data then just for current weather. Response contains data for next 5 days for every 3 hours. Data were filtere to be used for Charts both for One Day and for Five Days. 
More about API: https://openweathermap.org/forecast5 /  https://openweathermap.org/api .

## Repeating DISCLAIMER: Because Openweathermap API also free it gives you only data for current weather which not suitable for Charts. So 5 days Openweather API where used which gives you data about changes in weather every 3 hours for next five days. Data for one day was filtered and used as data for displaying Day weather. Another issue that it gives you data from current moment SO IF YOU USING IT LATE IN EVENING day Charts can have only one point. To display FIVE days Charts data were reduced to average for day.

## 6. Styling

Were used clean css without ui libraries.

## 7. Deployment
```
npm run deploy
```

In package.json:
```
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "deploy": "npm run build && gh-pages -d dist",
```
## 8. Not added
Due to free api from Openweathermap not being well suited for it day and night switcher wasn't implemented.
