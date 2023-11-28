<template>
    <div class="weather-display">
        <div class="weather-display__day-switcher">
          <button @click="switchView('day')" :class="{ active: currentView === 'day' }">Today</button>
          <button @click="switchView('week')" :class="{ active: currentView === 'week' }">Week</button>
        </div>
        
        <div v-if="currentView === 'day'">
          <div class="weather-display__block">
            <h3 class="block__text">{{ new Date().toLocaleDateString()  }}</h3>
            <p class="block__temp">Temperature: {{ Math.floor(averageWeatherToday.avgTemp) }}°C</p>
            <p class="block__feels">Feels Like: {{  Math.floor(averageWeatherToday.avgFeelsLike) }}°C</p>
            <p class="block__humidity">Humidity: {{ averageWeatherToday.minHumidity }} - {{ averageWeatherToday.maxHumidity }}%</p>
            <p class="block__wind">Wind Speed: {{ averageWeatherToday.minWind.toFixed(2) }} - {{ averageWeatherToday.maxWind.toFixed(2) }} m/s</p>
          </div>
        </div>

        <div v-else-if="currentView === 'week'">
          <div class="weather-display__block _week">
            <div class="block__column" v-for="dailyData in weeklyAverage" :key="dailyData.date">
                <h3 class="block__text">{{ new Date(dailyData.day).toLocaleDateString() }}</h3>
                <p class="block__temp">Temp.: {{ Math.floor(dailyData.averageTemp) }}°C</p>
                <p class="block__feels">Feels Like: {{ Math.floor(dailyData.averageFeelsLike) }}°C</p>
                <p class="block__humidity">Humidity: {{ dailyData.averageHumidity.toFixed(2) }}%</p>
                <p class="block__wind">Wind Speed: {{ dailyData.averageWindSpeed.toFixed(2) }} m/s</p>
            </div>
          </div>
        </div>

        <div class="weather-display__chart">
         <canvas ref="chart"></canvas>
        </div>

      </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
    props: {
        weatherData: {
            type: Object,
            default: null,
            required: false
        }
    },
    data() {
        return {
            currentView: 'day',
        };
    },
    computed: {
        filteredWeatherToday() {
            const today = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
            if (!this.weatherData) return []
            
            return this.weatherData.list
                .filter(hourlyData => {
                    const dateString = new Date(hourlyData.dt_txt).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });

                    return dateString === today;
                })
                .map(hourlyData => ({
                    dt: hourlyData.dt_txt,
                    main: {
                        temp: hourlyData.main.temp,
                        feelsLike: hourlyData.main.feels_like,
                        humidity: hourlyData.main.humidity
                    },
                    wind: hourlyData.wind.speed
                }));
        },
        averageWeatherToday() {
            if (this.filteredWeatherToday.length === 0) return {};

            const temperatures = this.filteredWeatherToday.map(data => data.main.temp);
            const feelsLikeTemps = this.filteredWeatherToday.map(data => data.main.feelsLike);
            const humidities = this.filteredWeatherToday.map(data => data.main.humidity);
            const winds = this.filteredWeatherToday.map(data => data.wind);

            return {
                avgTemp: this.calculateAverage(temperatures),
                avgFeelsLike: this.calculateAverage(feelsLikeTemps),
                minHumidity: Math.min(...humidities),
                maxHumidity: Math.max(...humidities),
                avgWind: this.calculateAverage(winds),
                minWind: Math.min(...winds),
                maxWind: Math.max(...winds),
            };
        },
        weeklyAverage() {
            const dailyData = this.weatherData.list.reduce((acc, hourlyData) => {
                const day = new Date(hourlyData.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
                acc[day] = acc[day] || {
                    totalTemp: 0,
                    totalFeelsLike: 0,
                    totalHumidity: 0,
                    totalWind: 0,
                    count: 0,
                    thisDay: hourlyData.dt_txt
                };

                acc[day].totalTemp += hourlyData.main.temp;
                acc[day].totalFeelsLike += hourlyData.main.feels_like;
                acc[day].totalHumidity += hourlyData.main.humidity;
                acc[day].totalWind += hourlyData.wind.speed;
                acc[day].count += 1;

                return acc;
            }, {});

            return Object.entries(dailyData).reduce((result, [day, { totalTemp, totalFeelsLike, totalHumidity, totalWind, count, thisDay }]) => {
                result[day] = {
                    averageTemp: totalTemp / count,
                    averageFeelsLike: totalFeelsLike / count,
                    averageHumidity: totalHumidity / count,
                    averageWindSpeed: totalWind / count,
                    day: thisDay
                };

                console.log(result)
                return result;
            }, {});
        },
    },
    methods: {
        calculateAverage(values) {
            if (values.length === 0) return 0;
            const sum = values.reduce((acc, value) => acc + value, 0);
            return sum / values.length;
        },
        formatTime(timestamp) {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        },
        switchView(view) {
            this.currentView = view;

            if (this.chart) {
                this.chart.destroy();
            }

            this.renderChart();

        },
        renderChart() {
            const context = this.$refs.chart.getContext('2d');

            if (this.currentView === 'day') {
                this.renderDayChart(context);
            } else {
                this.renderWeekChart(context);
            }
        },
        renderDayChart(context) {
            this.chart = new Chart(context, {
                type: 'line',
                data: {
                    labels: this.filteredWeatherToday.map(hourlyData => new Date(hourlyData.dt).getHours()),
                    datasets: [
                        {
                            label: 'Temperature',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            data: this.filteredWeatherToday.map(hourlyData => hourlyData.main.temp),
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Hours',
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                            },
                        },
                    },
                },
            });
        },
        renderWeekChart(context) {
            const weatherDates = this.weatherData.list.map(dailyData => dailyData.dt_txt);
            const dailyTempArr = this.weatherData.list.map(dailyData => dailyData.main.temp);
            
            this.chart = new Chart(context, {
                type: 'line',
                data: {
                    labels: weatherDates,
                    datasets: [
                        {
                            label: 'Temperature',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            data: dailyTempArr,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Date',
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                            },
                        },
                    },
                },
            });
        }
    },
    mounted() {
        this.renderChart();
    },
    watch: {
        weatherData: {
            handler() {
                if (this.currentView === 'day') {
                    this.chart.data.datasets[0].data = this.filteredWeatherToday.map(hourlyData => hourlyData.main.temp);
                    this.chart.data.labels = this.filteredWeatherToday.map(hourlyData => new Date(hourlyData.dt).getHours());
                } else {
                    this.chart.data.datasets[0].data = this.weatherData.list.map(dailyData => dailyData.main.temp);
                    this.chart.data.labels = this.weatherData.list.map(dailyData => new Date(dailyData.dt_txt).toLocaleDateString());
                }
                
                this.chart.update();
            },
            deep: true,
        }
    },
}
</script>

<style scoped>
.weather-display {
    font-size: 14px;
}

.weather-display__day-switcher button {
    margin-top: 10px;
    padding: 10px;
}

.weather-display__block {
    border-top: 2px solid;
    border-bottom: 2px solid;
    padding: 10px;
    margin: 10px;
    background-color:#fff;
}

.weather-display__block._week {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.block__column {
    width: 20%;
    padding: 0 5px;
}

.weather-display__block p {
    padding: 5px 0;
}

.block__text {
    text-align: center;
    font-weight: 700;
}

.active {
    background-color: #000;
    color: #fff;
}
</style>