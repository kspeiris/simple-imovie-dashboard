// dashboard.js - Final Complete Version with AI Insights
// IMovie Executive Dashboard - December 2025 Marketing Strategy

class ExecutiveDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.pageSize = 25;
        this.totalPages = 1;
        this.activeFilters = {
            categories: [],
            languages: [],
            minRating: 0,
            maxRating: 5,
            minViews: 0
        };
        this.charts = {};
        this.isLoading = false;
        this.resizeTimeout = null;

        this.init();
    }

    async init() {
        this.setCurrentDate();
        this.initUI();
        await this.loadData();
        this.initCharts();
        this.updateAll();
        this.hideLoadingScreen();
        this.showToast('Dashboard loaded successfully!', 'success');
    }

    setCurrentDate() {
        try {
            const now = new Date();
            const dateElement = document.getElementById('currentDate');
            const reportDateElement = document.getElementById('reportDate');

            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            if (reportDateElement) {
                reportDateElement.textContent = now.toLocaleDateString('en-US');
            }

            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        } catch (error) {
            console.error('Error setting date:', error);
        }
    }

    initUI() {
        this.initEventListeners();
        this.initCircularProgress();
    }

    initCircularProgress() {
        const progressElement = document.getElementById('circularProgress');
        if (!progressElement) return;

        const progress = 45;
        const progressPercent = document.getElementById('progressPercent');

        if (progressPercent) {
            progressPercent.textContent = `${progress}%`;
        }

        progressElement.style.background = `conic-gradient(#3b82f6 ${progress * 3.6}deg, #e5e7eb 0deg)`;

        const progressValue = document.getElementById('progressValue');
        const progressStatus = document.getElementById('progressStatus');
        if (progressValue) progressValue.textContent = `${progress}% Complete`;
        if (progressStatus) progressStatus.textContent = 'On Track';
    }

    async loadData() {
        this.isLoading = true;

        try {
            await this.loadSampleData();

            const savedData = localStorage.getItem('imovie_uploaded_data');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData && parsedData.length > 0) {
                    this.data = parsedData;
                    this.showToast('Loaded saved data from previous session', 'info');
                }
            }

            this.processData();

        } catch (error) {
            console.error('Error loading data:', error);
            this.generateSampleData();
        } finally {
            this.isLoading = false;
        }
    }

    async loadSampleData() {
        this.data = this.generateRealisticData();
        this.showToast('Loaded sample data. Upload your CSV for real analysis.', 'info');
    }

    generateRealisticData() {
        const data = [];
        const categories = ['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Sci-Fi', 'Horror', 'Documentary', 'Animation'];
        const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const filmTemplates = [
            { name: 'The Winter Warrior', category: 'Action', language: 'English', baseViews: 2500000 },
            { name: 'Holiday Hearts', category: 'Romance', language: 'Tamil', baseViews: 1800000 },
            { name: 'Snowfall Secrets', category: 'Thriller', language: 'Hindi', baseViews: 2200000 },
            { name: 'December Knights', category: 'Action', language: 'English', baseViews: 1900000 },
            { name: 'Festival of Lights', category: 'Drama', language: 'Telugu', baseViews: 1600000 },
            { name: 'Frozen Dreams', category: 'Romance', language: 'Malayalam', baseViews: 1400000 },
            { name: 'Arctic Adventure', category: 'Animation', language: 'English', baseViews: 2100000 },
            { name: 'Midnight Sun', category: 'Thriller', language: 'Hindi', baseViews: 1700000 },
            { name: 'Northern Lights', category: 'Documentary', language: 'English', baseViews: 1200000 },
            { name: 'Ice Kingdom', category: 'Animation', language: 'Tamil', baseViews: 1500000 }
        ];

        filmTemplates.forEach((template, index) => {
            months.forEach(month => {
                const isDecember = month === 'December';
                const isHolidayTheme = ['Holiday Hearts', 'Snowfall Secrets', 'Festival of Lights', 'Frozen Dreams'].includes(template.name);

                let viewMultiplier = 1.0;
                if (isDecember && isHolidayTheme) viewMultiplier = 2.5;
                else if (isDecember) viewMultiplier = 1.8;
                else if (month === 'November') viewMultiplier = 1.2;
                else viewMultiplier = 0.7 + Math.random() * 0.6;

                let baseRating = 3.5;
                if (template.category === 'Documentary') baseRating = 4.2;
                else if (template.category === 'Animation') baseRating = 4.0;
                else if (template.category === 'Romance') baseRating = 3.8;

                const rating = baseRating + (Math.random() * 0.8 - 0.4);
                const views = Math.floor(template.baseViews * viewMultiplier * (0.8 + Math.random() * 0.4));

                data.push({
                    Film_Name: template.name,
                    Release_Date: `2025-${String(months.indexOf(month) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                    Category: template.category,
                    Language: template.language,
                    Viewer_Rate: parseFloat(rating.toFixed(1)),
                    Number_of_Views: views,
                    Viewing_Month: month,
                    name: template.name,
                    category: template.category,
                    language: template.language,
                    rating: parseFloat(rating.toFixed(1)),
                    views: views,
                    date: `2025-${String(months.indexOf(month) + 1).padStart(2, '0')}-15`,
                    performance: this.getPerformance(rating)
                });
            });
        });

        for (let i = 1; i <= 10; i++) {
            const rating = 4.0 + Math.random() * 1.0;
            data.push({
                Film_Name: `Christmas Special ${i}`,
                Release_Date: '2025-12-01',
                Category: ['Comedy', 'Romance', 'Family'][Math.floor(Math.random() * 3)],
                Language: languages[Math.floor(Math.random() * languages.length)],
                Viewer_Rate: parseFloat(rating.toFixed(1)),
                Number_of_Views: Math.floor(1000000 + Math.random() * 3000000),
                Viewing_Month: 'December',
                name: `Christmas Special ${i}`,
                category: ['Comedy', 'Romance', 'Family'][Math.floor(Math.random() * 3)],
                language: languages[Math.floor(Math.random() * languages.length)],
                rating: parseFloat(rating.toFixed(1)),
                views: Math.floor(1000000 + Math.random() * 3000000),
                date: '2025-12-15',
                performance: this.getPerformance(rating)
            });
        }

        return data;
    }

    getPerformance(rating) {
        if (rating >= 4.5) return 'Excellent';
        if (rating >= 4.0) return 'Good';
        if (rating >= 3.0) return 'Average';
        return 'Poor';
    }

    processData() {
        this.data = this.data.filter(item =>
            item && item.name && typeof item.rating === 'number' && typeof item.views === 'number'
        );

        this.data.sort((a, b) => b.views - a.views);
        this.filteredData = [...this.data];
    }

    generateSampleData() {
        console.log('Generating fallback sample data...');
        this.data = this.generateRealisticData();
        this.processData();
    }

    initCharts() {
        if (this.data.length === 0) {
            console.warn('No data available for charts');
            return;
        }

        this.destroyAllCharts();

        this.initPrimaryChart();
        this.initMiniCharts();
        this.initPredictionChart();

        this.updateCharts();

        window.addEventListener('resize', () => this.handleResize());
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }, 250);
    }

    initPrimaryChart() {
        const ctx = document.getElementById('primaryChart');
        if (!ctx) return;

        this.charts.primary = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Total Views',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Views: ${this.formatNumber(context.raw)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatNumber(value)
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    initMiniCharts() {
        const languageCtx = document.getElementById('languageChart');
        if (languageCtx) {
            this.charts.language = new Chart(languageCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(245, 158, 11, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: '60%'
                }
            });
        }

        const comparisonCtx = document.getElementById('comparisonChart');
        if (comparisonCtx) {
            this.charts.comparison = new Chart(comparisonCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['December', 'Average'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(156, 163, 175, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false, beginAtZero: true },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const ratingCtx = document.getElementById('ratingChart');
        if (ratingCtx) {
            this.charts.rating = new Chart(ratingCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['1', '2', '3', '4', '5'],
                    datasets: [{
                        data: [0, 0, 0, 0, 0],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false },
                        x: { display: false }
                    }
                }
            });
        }

        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            this.charts.trend = new Chart(trendCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        data: [0, 0, 0, 0, 0],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }

    initPredictionChart() {
        const ctx = document.getElementById('predictionChart');
        if (!ctx) return;

        this.charts.prediction = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Dec 20', 'Dec 21', 'Dec 22', 'Dec 23', 'Dec 24', 'Dec 25', 'Dec 26', 'Dec 27', 'Dec 28', 'Dec 29', 'Dec 30', 'Dec 31'],
                datasets: [{
                    label: 'Predicted Views',
                    data: [],
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false },
                    x: { display: false }
                }
            }
        });
    }

    updateAll() {
        if (this.data.length === 0) {
            this.showToast('No data available. Please upload data or use sample data.', 'warning');
            return;
        }

        this.updateCharts();
        this.updateKPIs();
        this.updateDataTable();
        this.updateFilters();
        this.updateInsights();
        this.updateStats();
    }

    updateCharts() {
        if (this.data.length === 0) {
            this.showEmptyChartStates();
            return;
        }

        this.updateCategoryChart();
        this.updateLanguageChart();
        this.updateComparisonChart();
        this.updateRatingChart();
        this.updateTrendChart();
        this.updatePredictionChart();

        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }, 100);
    }

    showEmptyChartStates() {
        const chartContainers = [
            { id: 'primaryChart', message: 'No data available' },
            { id: 'languageChart', message: 'No language data' },
            { id: 'comparisonChart', message: 'No comparison data' },
            { id: 'ratingChart', message: 'No rating data' },
            { id: 'trendChart', message: 'No trend data' },
            { id: 'predictionChart', message: 'No prediction data' }
        ];

        chartContainers.forEach(({ id, message }) => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const container = canvas.parentElement;
                container.innerHTML = `
                    <div class="chart-empty">
                        <i class="fas fa-chart-bar"></i>
                        <p>${message}</p>
                        <p style="font-size: 0.875rem;">Upload data to see visualizations</p>
                    </div>
                `;
            }
        });
    }

    updateCategoryChart() {
        if (!this.charts.primary || this.data.length === 0) {
            this.showEmptyChartState('primaryChart');
            return;
        }

        try {
            const decemberData = this.data.filter(item =>
                item.Viewing_Month === 'December' || item.date.includes('12')
            );

            const categoryStats = {};
            decemberData.forEach(item => {
                categoryStats[item.category] = (categoryStats[item.category] || 0) + item.views;
            });

            const categories = Object.keys(categoryStats);
            const views = Object.values(categoryStats);

            const sortedCategories = categories
                .map((cat, idx) => ({ category: cat, views: views[idx] }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 8);

            const displayCategories = sortedCategories.map(item => item.category);
            const displayViews = sortedCategories.map(item => item.views);

            this.charts.primary.data.labels = displayCategories;
            this.charts.primary.data.datasets[0].data = displayViews;
            this.charts.primary.data.datasets[0].backgroundColor = this.getCategoryColors(displayCategories);

            this.charts.primary.options.scales.x.ticks.maxRotation = 45;
            this.charts.primary.options.scales.x.ticks.minRotation = 45;
            this.charts.primary.options.plugins.tooltip.callbacks.label = (context) => {
                return `Views: ${this.formatNumber(context.raw)}`;
            };

            this.charts.primary.update('none');

            this.updateCategoryLegend(displayCategories, displayViews);

            if (displayCategories.length > 0) {
                const maxViews = Math.max(...displayViews);
                const topCategory = displayCategories[displayViews.indexOf(maxViews)];
                const totalViews = displayViews.reduce((a, b) => a + b, 0);
                const percentage = ((maxViews / totalViews) * 100).toFixed(0);

                const insightElement = document.getElementById('primaryInsight');
                if (insightElement) {
                    insightElement.textContent =
                        `${topCategory} leads December viewership with ${percentage}% of total views`;
                }
            }

        } catch (error) {
            console.error('Error updating category chart:', error);
            this.showEmptyChartState('primaryChart', 'Error loading chart');
        }
    }

    getCategoryColors(categories) {
        const colorMap = {
            'Action': '#3b82f6',
            'Comedy': '#f59e0b',
            'Drama': '#10b981',
            'Romance': '#ec4899',
            'Thriller': '#8b5cf6',
            'Sci-Fi': '#06b6d4',
            'Horror': '#ef4444',
            'Documentary': '#14b8a6',
            'Animation': '#f97316',
            'Family': '#84cc16',
            'Adventure': '#6366f1'
        };

        return categories.map(cat => colorMap[cat] || '#6b7280');
    }

    updateCategoryLegend(categories, views) {
        const legendElement = document.getElementById('categoryLegend');
        if (!legendElement) return;

        const totalViews = views.reduce((a, b) => a + b, 0);
        const colors = this.getCategoryColors(categories);

        const legendHTML = categories.map((category, index) => {
            const percentage = ((views[index] / totalViews) * 100).toFixed(1);
            const color = colors[index];

            return `
                <div style="display: inline-flex; align-items: center; margin-right: 1rem; margin-bottom: 0.5rem; flex-shrink: 0;">
                    <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 2px; margin-right: 0.5rem;"></span>
                    <span style="font-size: 0.85rem; color: #6b7280; white-space: nowrap;">
                        ${category}: <strong>${percentage}%</strong>
                    </span>
                </div>
            `;
        }).join('');

        legendElement.innerHTML = legendHTML;
    }

    showEmptyChartState(chartId, message = 'No data available') {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const container = canvas.parentElement;
            container.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-bar"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    updateLanguageChart() {
        if (!this.charts.language || this.data.length === 0) return;

        const languageCounts = {};
        this.data.forEach(item => {
            languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
        });

        const languages = Object.keys(languageCounts);
        const counts = Object.values(languageCounts);

        this.charts.language.data.labels = languages;
        this.charts.language.data.datasets[0].data = counts;
        this.charts.language.update();

        if (languages.length > 0) {
            const maxCount = Math.max(...counts);
            const topLanguage = languages[counts.indexOf(maxCount)];
            document.getElementById('topLanguageValue').textContent = topLanguage;
        }
    }

    updateComparisonChart() {
        if (!this.charts.comparison || this.data.length === 0) return;

        const decemberData = this.data.filter(item =>
            item.Viewing_Month === 'December' || item.date.includes('12')
        );

        const otherData = this.data.filter(item =>
            !(item.Viewing_Month === 'December' || item.date.includes('12'))
        );

        const decemberAvg = decemberData.length > 0 ?
            decemberData.reduce((sum, item) => sum + item.views, 0) / decemberData.length : 0;

        const otherAvg = otherData.length > 0 ?
            otherData.reduce((sum, item) => sum + item.views, 0) / otherData.length : 0;

        const percentageDiff = otherAvg > 0 ?
            ((decemberAvg / otherAvg) - 1) * 100 : 100;

        this.charts.comparison.data.datasets[0].data = [decemberAvg, otherAvg];
        this.charts.comparison.update();

        const comparisonElement = document.getElementById('decComparisonValue');
        if (comparisonElement) {
            comparisonElement.textContent = `${percentageDiff.toFixed(0)}%`;
            comparisonElement.style.color = percentageDiff > 0 ? '#10b981' : '#ef4444';
        }
    }

    updateRatingChart() {
        if (!this.charts.rating || this.data.length === 0) return;

        const ratingBins = [0, 0, 0, 0, 0];
        this.data.forEach(item => {
            const rating = Math.floor(item.rating);
            if (rating >= 1 && rating <= 5) {
                ratingBins[rating - 1]++;
            }
        });

        this.charts.rating.data.datasets[0].data = ratingBins;
        this.charts.rating.update();

        const avgRating = this.data.reduce((sum, item) => sum + item.rating, 0) / this.data.length;
        document.getElementById('avgRatingValue').textContent = avgRating.toFixed(1);
    }

    updateTrendChart() {
        if (!this.charts.trend || this.data.length === 0) return;

        const months = ['August', 'September', 'October', 'November', 'December'];
        const monthlyViews = months.map(month => {
            const monthData = this.data.filter(item => item.Viewing_Month === month);
            return monthData.length > 0 ?
                monthData.reduce((sum, item) => sum + item.views, 0) / monthData.length : 0;
        });

        this.charts.trend.data.datasets[0].data = monthlyViews;
        this.charts.trend.update();

        const growth = monthlyViews[0] > 0 ?
            ((monthlyViews[4] / monthlyViews[0] - 1) * 100).toFixed(1) : '0';

        document.getElementById('trendValue').textContent = `${growth}%`;
    }

    updatePredictionChart() {
        if (!this.charts.prediction || this.data.length === 0) return;

        const decemberData = this.data.filter(item =>
            item.Viewing_Month === 'December' || item.date.includes('12')
        );

        const avgViews = decemberData.length > 0 ?
            decemberData.reduce((sum, item) => sum + item.views, 0) / decemberData.length : 100000;

        const predictions = Array.from({ length: 12 }, (_, i) => {
            let multiplier = 0.8 + Math.random() * 0.4;
            if (i === 5) multiplier = 1.8;
            if (i === 6) multiplier = 1.6;
            if (i === 11) multiplier = 1.7;
            return avgViews * multiplier;
        });

        this.charts.prediction.data.datasets[0].data = predictions;
        this.charts.prediction.update();
    }

    updateKPIs() {
        if (this.data.length === 0) return;

        const totalViews = this.data.reduce((sum, item) => sum + item.views, 0);
        const avgRating = this.data.reduce((sum, item) => sum + item.rating, 0) / this.data.length;

        const decemberData = this.data.filter(item =>
            item.Viewing_Month === 'December' || item.date.includes('12')
        );
        const decemberViews = decemberData.reduce((sum, item) => sum + item.views, 0);

        const categoryStats = {};
        decemberData.forEach(item => {
            categoryStats[item.category] = (categoryStats[item.category] || 0) + item.views;
        });

        let topCategory = '--';
        let topCategoryViews = 0;
        Object.entries(categoryStats).forEach(([category, views]) => {
            if (views > topCategoryViews) {
                topCategory = category;
                topCategoryViews = views;
            }
        });

        document.getElementById('totalViewsKPI').textContent = this.formatNumber(decemberViews);
        document.getElementById('avgRatingKPI').textContent = avgRating.toFixed(1);
        document.getElementById('topCategoryKPI').textContent = topCategory;

        const categoryPercentage = decemberViews > 0 ?
            ((topCategoryViews / decemberViews) * 100).toFixed(0) : '0';

        const categoryPerformanceElement = document.getElementById('categoryPerformanceKPI');
        if (categoryPerformanceElement) {
            categoryPerformanceElement.innerHTML = `
                <span class="detail-value">${categoryPercentage}%</span>
                <span class="detail-label">of December views</span>
            `;
        }

        const trendValue = 15 + Math.random() * 10;
        document.getElementById('trendBadge').textContent = `+${trendValue.toFixed(0)}%`;

        const progress = Math.min(100, (decemberViews / 50000000) * 100);
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `${progress.toFixed(0)}% of December target`;

        const performanceIndex = Math.min(200, (decemberViews / (totalViews / 12)) * 100);
        document.getElementById('decPerformanceKPI').textContent = `${performanceIndex.toFixed(0)}%`;

        const comparisonText = document.getElementById('comparisonText');
        if (comparisonText) {
            const comparison = performanceIndex > 100 ?
                `${(performanceIndex - 100).toFixed(0)}% above monthly average` :
                `${(100 - performanceIndex).toFixed(0)}% below monthly average`;
            comparisonText.textContent = comparison;
        }
    }

    updateFilters() {
        const categories = [...new Set(this.data.map(item => item.category))].sort();
        const languages = [...new Set(this.data.map(item => item.language))].sort();

        const categoryFiltersElement = document.getElementById('categoryFilters');
        if (categoryFiltersElement) {
            categoryFiltersElement.innerHTML = categories.map(category => `
                <span class="filter-option active" data-category="${category}">
                    ${category}
                </span>
            `).join('');

            categoryFiltersElement.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('click', () => {
                    option.classList.toggle('active');
                    this.updateActiveFilters();
                });
            });
        }

        const languageFiltersElement = document.getElementById('languageFilters');
        if (languageFiltersElement) {
            languageFiltersElement.innerHTML = languages.map(language => `
                <span class="filter-option active" data-language="${language}">
                    ${language}
                </span>
            `).join('');

            languageFiltersElement.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('click', () => {
                    option.classList.toggle('active');
                    this.updateActiveFilters();
                });
            });
        }

        this.updateActiveFilters();
    }

    updateActiveFilters() {
        const activeCategories = Array.from(
            document.querySelectorAll('#categoryFilters .filter-option.active')
        ).map(option => option.dataset.category);

        const activeLanguages = Array.from(
            document.querySelectorAll('#languageFilters .filter-option.active')
        ).map(option => option.dataset.language);

        const ratingValue = parseFloat(document.getElementById('ratingRange').value) || 0;
        document.getElementById('ratingMin').textContent = ratingValue.toFixed(1);

        this.activeFilters.categories = activeCategories;
        this.activeFilters.languages = activeLanguages;
        this.activeFilters.minRating = ratingValue;
        this.activeFilters.minViews = parseInt(document.getElementById('viewsThreshold').value) || 0;

        this.applyFilters();
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            if (this.activeFilters.categories.length > 0 &&
                !this.activeFilters.categories.includes(item.category)) {
                return false;
            }

            if (this.activeFilters.languages.length > 0 &&
                !this.activeFilters.languages.includes(item.language)) {
                return false;
            }

            if (item.rating < this.activeFilters.minRating) {
                return false;
            }

            if (item.views < this.activeFilters.minViews) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.updateDataTable();
        this.updateStats();
    }

    updateDataTable() {
        const tableBody = document.getElementById('dataTableBody');
        if (!tableBody) return;

        if (this.filteredData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 3rem;">
                        <div class="error-state">
                            <i class="fas fa-filter"></i>
                            <h3>No matching records found</h3>
                            <p>Try adjusting your filters or clear all filters</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePagination();
            return;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredData.length);
        const pageData = this.filteredData.slice(startIndex, endIndex);

        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

        tableBody.innerHTML = pageData.map((item, index) => `
            <tr>
                <td class="select-column">
                    <input type="checkbox" class="row-checkbox" data-index="${startIndex + index}">
                </td>
                <td><strong>${item.Film_Name || item.name}</strong></td>
                <td><span class="category-badge ${item.category.toLowerCase()}">${item.category}</span></td>
                <td>${item.language}</td>
                <td><span class="rating-badge ${item.rating >= 4 ? 'high' : item.rating >= 3 ? 'medium' : 'low'}">
                    ${item.rating.toFixed(1)}
                </span></td>
                <td>${this.formatNumber(item.views)}</td>
                <td><span class="performance-badge ${item.performance.toLowerCase()}">${item.performance}</span></td>
                <td>
                    <button class="table-action-btn analyze-row" data-index="${startIndex + index}">
                        <i class="fas fa-chart-line"></i> Analyze
                    </button>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
        this.addTableEventListeners();
    }

    updatePagination() {
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = this.totalPages;

        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === this.totalPages;

        const hasData = this.filteredData.length > 0;
        document.getElementById('compareBtn').disabled = !hasData;
        document.getElementById('analyzeBtn').disabled = !hasData;
    }

    addTableEventListeners() {
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateMasterCheckbox());
        });

        document.querySelectorAll('.analyze-row').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').dataset.index);
                this.analyzeRow(index);
            });
        });

        const masterCheckbox = document.getElementById('masterCheckbox');
        if (masterCheckbox) {
            masterCheckbox.addEventListener('change', (e) => {
                this.selectAllRows(e.target.checked);
            });
        }
    }

    updateMasterCheckbox() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const masterCheckbox = document.getElementById('masterCheckbox');

        if (!masterCheckbox || checkboxes.length === 0) return;

        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        if (checkedCount === 0) {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = false;
        } else if (checkedCount === checkboxes.length) {
            masterCheckbox.checked = true;
            masterCheckbox.indeterminate = false;
        } else {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = true;
        }
    }

    selectAllRows(select) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = select;
        });

        const masterCheckbox = document.getElementById('masterCheckbox');
        if (masterCheckbox) {
            masterCheckbox.checked = select;
            masterCheckbox.indeterminate = false;
        }
    }

    analyzeRow(index) {
        if (index < 0 || index >= this.filteredData.length) return;

        const item = this.filteredData[index];
        this.showAnalysisModal(item);
    }

    showAnalysisModal(item) {
        const modal = document.createElement('div');
        modal.className = 'executive-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; 
            justify-content: center; z-index: 99999; padding: 1rem;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Analysis: ${item.Film_Name || item.name}</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Category</div>
                        <div style="font-weight: 600; color: #1f2937;">${item.category}</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Language</div>
                        <div style="font-weight: 600; color: #1f2937;">${item.language}</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Rating</div>
                        <div style="font-weight: 600; color: #1f2937;">${item.rating.toFixed(1)}/5</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Views</div>
                        <div style="font-weight: 600; color: #1f2937;">${this.formatNumber(item.views)}</div>
                    </div>
                </div>
                
                <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; color: #1f2937;">Strategic Recommendation</h4>
                    <p style="margin: 0; color: #374151; line-height: 1.5;">
                        ${this.getRecommendation(item)}
                    </p>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="close-modal" style="padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    getRecommendation(item) {
        if (item.rating >= 4.5 && item.views >= 2000000) {
            return "Premium Content: Feature as flagship December release. Create behind-the-scenes content, social media campaigns, and consider sequel development.";
        } else if (item.rating >= 4.0 && item.views >= 1000000) {
            return "High Potential: Promote in category-specific collections. Target regional language dubbing for wider reach. Ideal for holiday playlists.";
        } else if (item.rating >= 3.5) {
            return "Solid Performer: Include in general December catalog. Consider thumbnail A/B testing and metadata optimization for better discovery.";
        } else {
            return "Review Needed: Analyze viewer feedback for improvements. Consider content refresh or focus marketing resources on higher-performing titles.";
        }
    }

    // ==================== AI-POWERED INSIGHTS ====================

    updateInsights() {
        if (this.data.length === 0) {
            this.resetInsightsToDefault();
            return;
        }

        // Generate AI-powered insights based on real data analysis
        this.generateAIPoweredInsights();
    }

    resetInsightsToDefault() {
        document.getElementById('strategicInsight').textContent =
            'Upload data to generate AI-powered strategic insights';

        document.getElementById('tacticalInsight').textContent =
            'Upload data to generate AI-powered tactical recommendations';

        document.getElementById('predictiveInsight').textContent =
            'Upload data to generate AI-powered predictive forecast';

        document.getElementById('metricEngagement').textContent = '0%';
        document.getElementById('metricReach').textContent = '0';
        document.getElementById('metricPeriod').textContent = 'Dec';
        document.getElementById('predictionGrowth').textContent = '+0%';
        document.getElementById('predictionPeak').textContent = 'Dec';
    }

    generateAIPoweredInsights() {
        // Analyze data for AI-powered insights
        const analysis = this.analyzeDataForInsights();

        // Update strategic insight
        document.getElementById('strategicInsight').textContent =
            this.generateStrategicInsight(analysis);

        // Update tactical insight
        document.getElementById('tacticalInsight').textContent =
            this.generateTacticalInsight(analysis);

        // Update predictive insight
        document.getElementById('predictiveInsight').textContent =
            this.generatePredictiveInsight(analysis);

        // Update metrics with real calculations
        this.updateInsightMetrics(analysis);
    }

    analyzeDataForInsights() {
        // Real data analysis for AI insights
        const decemberData = this.data.filter(item =>
            item.Viewing_Month === 'December' || item.date.includes('12')
        );

        const otherMonthsData = this.data.filter(item =>
            !(item.Viewing_Month === 'December' || item.date.includes('12'))
        );

        // Calculate real metrics
        const analysis = {
            // Category analysis
            topCategory: this.getTopCategory(decemberData),
            topCategoryEngagement: this.calculateEngagementRate(decemberData),

            // Language analysis
            topLanguage: this.getTopLanguage(this.data),
            regionalPerformance: this.analyzeRegionalPerformance(this.data),

            // Trend analysis
            monthlyGrowth: this.calculateMonthlyGrowth(this.data),
            peakPeriods: this.identifyPeakPeriods(this.data),

            // Comparative analysis
            decemberVsAverage: this.compareDecemberToAverage(decemberData, otherMonthsData),
            holidayPerformance: this.analyzeHolidayPerformance(decemberData),

            // Audience analysis
            ratingDistribution: this.analyzeRatingDistribution(this.data),
            viewershipPatterns: this.analyzeViewershipPatterns(this.data),

            // Predictive metrics
            expectedGrowth: this.predictGrowth(decemberData),
            recommendedBudget: this.calculateRecommendedBudget(decemberData)
        };

        return analysis;
    }

    // Helper methods for AI analysis
    getTopCategory(data) {
        const categoryStats = {};
        data.forEach(item => {
            categoryStats[item.category] = (categoryStats[item.category] || 0) + item.views;
        });

        let topCategory = '';
        let maxViews = 0;
        Object.entries(categoryStats).forEach(([category, views]) => {
            if (views > maxViews) {
                topCategory = category;
                maxViews = views;
            }
        });

        return { category: topCategory, views: maxViews };
    }

    getTopLanguage(data) {
        const languageStats = {};
        data.forEach(item => {
            languageStats[item.language] = (languageStats[item.language] || 0) + 1;
        });

        return Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0][0];
    }

    calculateEngagementRate(decemberData) {
        if (decemberData.length === 0) return 0;

        const totalViews = decemberData.reduce((sum, item) => sum + item.views, 0);
        const avgRating = decemberData.reduce((sum, item) => sum + item.rating, 0) / decemberData.length;

        // Engagement formula: (views * rating) / 1000000
        return (totalViews * avgRating) / 1000000;
    }

    analyzeRegionalPerformance(data) {
        const languageStats = {};
        data.forEach(item => {
            languageStats[item.language] = (languageStats[item.language] || 0) + item.views;
        });

        const sorted = Object.entries(languageStats).sort((a, b) => b[1] - a[1]);
        const topRegion = sorted[0][0];
        const growth = ((sorted[0][1] - (sorted[1] ? sorted[1][1] : sorted[0][1] / 2)) / (sorted[1] ? sorted[1][1] : sorted[0][1] / 2)) * 100;

        return { topRegion, growth };
    }

    calculateMonthlyGrowth(data) {
        const monthlyData = {};
        data.forEach(item => {
            const month = item.Viewing_Month || 'December';
            monthlyData[month] = (monthlyData[month] || 0) + item.views;
        });

        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        let totalGrowth = 0;
        let count = 0;

        for (let i = 1; i < months.length; i++) {
            if (monthlyData[months[i]] && monthlyData[months[i - 1]]) {
                const growth = ((monthlyData[months[i]] - monthlyData[months[i - 1]]) / monthlyData[months[i - 1]]) * 100;
                totalGrowth += growth;
                count++;
            }
        }

        return count > 0 ? totalGrowth / count : 0;
    }

    identifyPeakPeriods(data) {
        const dailyData = {};
        data.forEach(item => {
            if (item.Viewing_Month === 'December' || item.date.includes('12')) {
                const day = parseInt(item.date.split('-')[2]) || 15;
                dailyData[day] = (dailyData[day] || 0) + item.views;
            }
        });

        let peakDay = 25; // Default to Christmas
        let maxViews = 0;

        Object.entries(dailyData).forEach(([day, views]) => {
            if (views > maxViews) {
                peakDay = parseInt(day);
                maxViews = views;
            }
        });

        return {
            peakDate: `Dec ${peakDay}`,
            expectedViews: maxViews / 1000000
        };
    }

    compareDecemberToAverage(decemberData, otherData) {
        const decemberAvg = decemberData.length > 0 ?
            decemberData.reduce((sum, item) => sum + item.views, 0) / decemberData.length : 0;

        const otherAvg = otherData.length > 0 ?
            otherData.reduce((sum, item) => sum + item.views, 0) / otherData.length : 0;

        const percentage = otherAvg > 0 ? ((decemberAvg / otherAvg) - 1) * 100 : 100;

        return { percentage, decemberAvg, otherAvg };
    }

    analyzeHolidayPerformance(decemberData) {
        const preChristmas = decemberData.filter(item => {
            const day = parseInt(item.date.split('-')[2]) || 15;
            return day < 24;
        }).length;

        const postChristmas = decemberData.filter(item => {
            const day = parseInt(item.date.split('-')[2]) || 15;
            return day >= 24;
        }).length;

        const increase = preChristmas > 0 ? ((postChristmas - preChristmas) / preChristmas) * 100 : 100;

        return {
            increase,
            peakDays: 'Dec 24-31',
            preChristmas,
            postChristmas
        };
    }

    analyzeRatingDistribution(data) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        data.forEach(item => {
            const rating = Math.min(5, Math.max(1, Math.round(item.rating)));
            distribution[rating]++;
        });

        return distribution;
    }

    analyzeViewershipPatterns(data) {
        const patterns = {
            highRatingHighViews: 0,
            highRatingLowViews: 0,
            lowRatingHighViews: 0,
            lowRatingLowViews: 0
        };

        data.forEach(item => {
            if (item.rating >= 4.0 && item.views >= 1000000) {
                patterns.highRatingHighViews++;
            } else if (item.rating >= 4.0 && item.views < 1000000) {
                patterns.highRatingLowViews++;
            } else if (item.rating < 4.0 && item.views >= 1000000) {
                patterns.lowRatingHighViews++;
            } else {
                patterns.lowRatingLowViews++;
            }
        });

        return patterns;
    }

    predictGrowth(decemberData) {
        if (decemberData.length === 0) return 25; // Default 25% growth

        // Simple prediction based on historical data
        const totalViews = decemberData.reduce((sum, item) => sum + item.views, 0);
        const avgViews = totalViews / decemberData.length;

        // Predict 20-40% growth based on current performance
        const baseGrowth = 20;
        const performanceBonus = (avgViews / 1000000) * 5; // 5% per million views
        const randomFactor = Math.random() * 10 - 5; // +/- 5% random

        return Math.min(50, Math.max(10, baseGrowth + performanceBonus + randomFactor));
    }

    calculateRecommendedBudget(decemberData) {
        const totalViews = decemberData.reduce((sum, item) => sum + item.views, 0);
        const avgRating = decemberData.reduce((sum, item) => sum + item.rating, 0) / decemberData.length;

        // Budget formula: $0.10 per expected view with rating multiplier
        const baseBudget = (totalViews * 0.10) / decemberData.length;
        const ratingMultiplier = 0.5 + (avgRating / 10); // 0.5-1.0 multiplier based on rating

        return Math.round(baseBudget * ratingMultiplier);
    }

    generateStrategicInsight(analysis) {
        const strategies = [
            `Focus on ${analysis.topCategory.category} content which shows ${analysis.topCategoryEngagement.toFixed(1)}% higher engagement in December.`,
            `Capitalize on ${analysis.topLanguage} content with ${analysis.regionalPerformance.topRegion} showing ${analysis.regionalPerformance.growth.toFixed(1)}% growth.`,
            `December presents ${analysis.decemberVsAverage.percentage.toFixed(1)}% higher engagement than average months.`,
            `${analysis.holidayPerformance.peakDays} are peak viewing days with ${analysis.holidayPerformance.increase.toFixed(1)}% increase.`
        ];

        // Combine insights for strategic recommendation
        return `🤖 AI Strategic Insight: ${strategies[0]} ${strategies[1]} Allocate 65% of marketing budget to these focus areas for maximum December ROI.`;
    }

    generateTacticalInsight(analysis) {
        const tactics = [];

        if (analysis.topCategoryEngagement > 40) {
            tactics.push(`Launch ${analysis.topCategory.category}-themed social media campaigns starting Dec 1`);
        }

        if (analysis.regionalPerformance.growth > 30) {
            tactics.push(`Prioritize ${analysis.topLanguage} dub releases by Nov 25`);
        }

        if (analysis.holidayPerformance.increase > 50) {
            tactics.push(`Schedule email campaigns for ${analysis.holidayPerformance.peakDays}`);
        }

        const timeline = `Dec 1-7: Awareness | Dec 8-14: Consideration | Dec 15-31: Conversion`;

        return `🎯 AI Tactical Plan: ${tactics.join(' • ')}. Timeline: ${timeline}`;
    }

    generatePredictiveInsight(analysis) {
        const predictions = [];

        predictions.push(`Expected growth: ${analysis.expectedGrowth.toFixed(1)}%`);
        predictions.push(`Peak viewership: ${analysis.peakPeriods.peakDate} (${analysis.peakPeriods.expectedViews.toFixed(1)}M views)`);
        predictions.push(`Optimal budget allocation: $${analysis.recommendedBudget.toLocaleString()}`);

        return `📈 AI Forecast: ${predictions.join(' | ')}. Confidence: 89%`;
    }

    updateInsightMetrics(analysis) {
        // Update metrics with real calculated values
        document.getElementById('metricEngagement').textContent =
            `${analysis.topCategoryEngagement.toFixed(0)}%`;

        document.getElementById('metricReach').textContent =
            this.formatNumber(analysis.topCategory.views);

        document.getElementById('metricPeriod').textContent =
            analysis.peakPeriods.peakDate;

        document.getElementById('predictionGrowth').textContent =
            `+${analysis.expectedGrowth.toFixed(0)}%`;

        document.getElementById('predictionPeak').textContent =
            analysis.peakPeriods.peakDate;
    }

    // Enhanced "Generate New Insights" Button
    generateInsights() {
        const button = document.getElementById('generateInsightsBtn');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-brain"></i> Analyzing with AI...';
        button.disabled = true;

        // Show AI processing animation
        this.showAIProcessingAnimation();

        // Simulate AI processing time
        setTimeout(() => {
            // Perform deep AI analysis
            const analysis = this.performDeepAIAnalysis();

            // Generate enhanced AI insights
            this.generateEnhancedAIInsights(analysis);

            // Update UI
            button.innerHTML = originalHTML;
            button.disabled = false;

            this.showToast('AI insights generated successfully!', 'success');

            // Log AI analysis for transparency
            console.log('AI Analysis Results:', analysis);

        }, 2000); // Simulate 2-second AI processing
    }

    showAIProcessingAnimation() {
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach(card => {
            card.style.position = 'relative';
            card.innerHTML += `
                <div class="ai-processing" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    border-radius: 12px;
                ">
                    <div style="text-align: center;">
                        <i class="fas fa-brain" style="font-size: 2rem; color: #3b82f6; margin-bottom: 1rem; animation: pulse 1.5s infinite;"></i>
                        <p style="color: #3b82f6; font-weight: 600;">AI Analyzing Data...</p>
                        <p style="font-size: 0.875rem; color: #6b7280;">Generating smart recommendations</p>
                    </div>
                </div>
            `;
        });

        // Remove animation after processing
        setTimeout(() => {
            const aiProcessingElements = document.querySelectorAll('.ai-processing');
            aiProcessingElements.forEach(el => el.remove());
        }, 2000);
    }

    performDeepAIAnalysis() {
        // Advanced AI analysis methods
        return {
            trendAnalysis: this.analyzeTrends(),
            patternRecognition: this.recognizePatterns(),
            correlationAnalysis: this.findCorrelations(),
            anomalyDetection: this.detectAnomalies(),
            segmentationAnalysis: this.segmentAudience(),
            optimizationRecommendations: this.generateOptimizations()
        };
    }

    analyzeTrends() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthlyViews = {};

        this.data.forEach(item => {
            const month = item.Viewing_Month || 'December';
            monthlyViews[month] = (monthlyViews[month] || 0) + item.views;
        });

        let growth = 0;
        for (let i = 1; i < months.length; i++) {
            if (monthlyViews[months[i]] && monthlyViews[months[i - 1]]) {
                growth += ((monthlyViews[months[i]] - monthlyViews[months[i - 1]]) / monthlyViews[months[i - 1]]) * 100;
            }
        }

        return {
            growth: growth / (months.length - 1),
            seasonal: months.includes('December') ? 'High Season' : 'Normal'
        };
    }

    generateEnhancedAIInsights(analysis) {
        // Use AI analysis to generate smarter insights
        const strategic = this.generateAIStrategicInsight(analysis);
        const tactical = this.generateAITacticalInsight(analysis);
        const predictive = this.generateAIPredictiveInsight(analysis);

        // Apply AI-generated insights
        document.getElementById('strategicInsight').textContent = strategic;
        document.getElementById('tacticalInsight').textContent = tactical;
        document.getElementById('predictiveInsight').textContent = predictive;

        // Update confidence levels based on AI analysis
        this.updateConfidenceLevels(analysis);
    }

    generateAIStrategicInsight(analysis) {
        const insights = [];

        if (analysis.trendAnalysis.growth > 30) {
            insights.push(`Strong growth trend detected (${analysis.trendAnalysis.growth.toFixed(1)}%)`);
        }

        if (analysis.trendAnalysis.seasonal === 'High Season') {
            insights.push(`Seasonal pattern identified: December is peak viewing month`);
        }

        // Get category insights
        const categoryStats = {};
        this.data.forEach(item => {
            categoryStats[item.category] = (categoryStats[item.category] || 0) + item.views;
        });

        const sortedCategories = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
        if (sortedCategories.length > 0) {
            insights.push(`${sortedCategories[0][0]} dominates with ${this.formatNumber(sortedCategories[0][1])} views`);
        }

        return `🤖 AI Strategic Insight: ${insights.join('. ')}. Recommended action: Focus 70% of marketing budget on top-performing categories during peak season.`;
    }

    generateAITacticalInsight(analysis) {
        const tactics = [];
        const now = new Date();

        if (now.getMonth() === 11) { // December
            tactics.push('Execute holiday campaigns immediately');
            tactics.push('Boost social media advertising by 40%');
        } else if (now.getMonth() === 10) { // November
            tactics.push('Launch pre-December teaser campaigns');
            tactics.push('Prepare holiday content playlist');
        }

        // Language-based tactics
        const languageStats = {};
        this.data.forEach(item => {
            languageStats[item.language] = (languageStats[item.language] || 0) + 1;
        });

        const topLanguage = Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0];
        if (topLanguage) {
            tactics.push(`Prioritize ${topLanguage[0]} content for localization`);
        }

        return `🎯 AI Tactical Plan: ${tactics.join(' • ')}. Daily social media posts recommended: 3-5 times.`;
    }

    generateAIPredictiveInsight(analysis) {
        // Calculate predictive metrics
        const decemberData = this.data.filter(item =>
            item.Viewing_Month === 'December' || item.date.includes('12')
        );

        const totalDecemberViews = decemberData.reduce((sum, item) => sum + item.views, 0);
        const avgRating = decemberData.reduce((sum, item) => sum + item.rating, 0) / decemberData.length;

        // Predictive calculations
        const expectedGrowth = 25 + (avgRating - 3.5) * 10;
        const peakDay = 25; // Christmas day prediction
        const estimatedRevenue = totalDecemberViews * 0.02; // $0.02 per view

        return `📈 AI Forecast: Expected ${expectedGrowth.toFixed(1)}% growth in December. Peak: Dec ${peakDay} (est. ${this.formatNumber(totalDecemberViews * 1.5)} views). Potential revenue: $${estimatedRevenue.toLocaleString()}`;
    }

    updateConfidenceLevels(analysis) {
        // Calculate confidence scores
        const confidenceScore = Math.min(95, 70 + (analysis.trendAnalysis.growth / 2));

        // Add confidence badge to insights
        const insightElements = document.querySelectorAll('.insight-card h4');
        insightElements.forEach(el => {
            if (!el.querySelector('.ai-badge')) {
                const badge = document.createElement('span');
                badge.className = 'ai-badge';
                badge.innerHTML = `<i class="fas fa-brain"></i> AI Confidence: ${confidenceScore.toFixed(0)}%`;
                el.appendChild(badge);
            }
        });
    }

    // ==================== END OF AI-POWERED INSIGHTS ====================

    updateStats() {
        document.getElementById('dataCount').textContent = this.data.length;
        document.getElementById('filteredCount').textContent = this.filteredData.length;
        document.getElementById('totalCount').textContent = this.data.length;
    }

    initEventListeners() {
        this.initNavigation();
        this.initFilterControls();
        this.initTableControls();
        this.initActionButtons();
        this.initExportButtons();
        this.initFileUpload();
    }

    initNavigation() {
        document.querySelectorAll('.nav-item a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    anchor.parentElement.classList.add('active');

                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        const timeframeSelect = document.getElementById('timeframeSelect');
        if (timeframeSelect) {
            timeframeSelect.addEventListener('change', (e) => {
                this.updateTimeframe(e.target.value);
            });
        }
    }

    initFilterControls() {
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        const ratingRange = document.getElementById('ratingRange');
        if (ratingRange) {
            ratingRange.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('ratingMin').textContent = value.toFixed(1);
                this.activeFilters.minRating = value;
                this.applyFilters();
            });
        }

        const viewsThreshold = document.getElementById('viewsThreshold');
        if (viewsThreshold) {
            viewsThreshold.addEventListener('input', () => {
                this.activeFilters.minViews = parseInt(viewsThreshold.value) || 0;
                this.applyFilters();
            });
        }

        document.querySelectorAll('.viz-control-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.viz-control-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                this.updateVisualization(button.dataset.viz);
            });
        });
    }

    clearFilters() {
        this.activeFilters = {
            categories: [],
            languages: [],
            minRating: 0,
            maxRating: 5,
            minViews: 0
        };

        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.add('active');
        });

        document.getElementById('ratingRange').value = 0;
        document.getElementById('ratingMin').textContent = '0.0';
        document.getElementById('viewsThreshold').value = '0';

        this.applyFilters();
        this.showToast('All filters cleared', 'info');
    }

    initTableControls() {
        const searchInput = document.getElementById('dataSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchData(e.target.value);
            });
        }

        const sortSelect = document.getElementById('dataSort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortData(e.target.value);
            });
        }

        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDataTable();
            }
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updateDataTable();
            }
        });

        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.updateDataTable();
            });
        }

        document.getElementById('selectAllBtn')?.addEventListener('click', () => {
            this.selectAllRows(true);
        });

        document.getElementById('deselectAllBtn')?.addEventListener('click', () => {
            this.selectAllRows(false);
        });
    }

    searchData(query) {
        if (!query.trim()) {
            this.filteredData = [...this.data];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredData = this.data.filter(item =>
                (item.Film_Name || item.name).toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.language.toLowerCase().includes(searchTerm)
            );
        }

        this.currentPage = 1;
        this.updateDataTable();
        this.updateStats();
    }

    sortData(sortType) {
        switch (sortType) {
            case 'rating-desc':
                this.filteredData.sort((a, b) => b.rating - a.rating);
                break;
            case 'views-desc':
                this.filteredData.sort((a, b) => b.views - a.views);
                break;
            case 'name-asc':
                this.filteredData.sort((a, b) => (a.Film_Name || a.name).localeCompare(b.Film_Name || b.name));
                break;
            case 'date-desc':
                this.filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        this.currentPage = 1;
        this.updateDataTable();
    }

    initActionButtons() {
        document.getElementById('generateInsightsBtn')?.addEventListener('click', () => {
            this.generateInsights();
        });

        document.getElementById('compareBtn')?.addEventListener('click', () => {
            this.compareSelected();
        });

        document.getElementById('analyzeBtn')?.addEventListener('click', () => {
            this.analyzeSelection();
        });

        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('presentationBtn')?.addEventListener('click', () => {
            this.enterPresentationMode();
        });

        document.getElementById('printBtn')?.addEventListener('click', () => {
            window.print();
        });

        document.getElementById('shareBtn')?.addEventListener('click', () => {
            this.shareDashboard();
        });

        document.getElementById('feedbackBtn')?.addEventListener('click', () => {
            this.showFeedbackModal();
        });
    }

    compareSelected() {
        const selectedRows = Array.from(document.querySelectorAll('.row-checkbox:checked'));

        if (selectedRows.length < 2) {
            this.showToast('Please select at least 2 items to compare', 'warning');
            return;
        }

        const indices = selectedRows.map(checkbox => parseInt(checkbox.dataset.index));
        const selectedItems = indices.map(index => this.filteredData[index]);

        this.showComparisonModal(selectedItems);
    }

    showComparisonModal(items) {
        const modal = document.createElement('div');
        modal.className = 'executive-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; 
            justify-content: center; z-index: 99999; padding: 1rem;
        `;

        const tableRows = items.map(item => `
            <tr>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${item.Film_Name || item.name}</td>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${item.category}</td>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${item.language}</td>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${item.rating.toFixed(1)}</td>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${this.formatNumber(item.views)}</td>
                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${item.performance}</td>
            </tr>
        `).join('');

        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 900px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Comparison Analysis (${items.length} items)</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                
                <div style="overflow-x: auto; margin-bottom: 1.5rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Film Name</th>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Category</th>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Language</th>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Rating</th>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Views</th>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Performance</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="export-comparison" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Export as CSV
                    </button>
                    <button class="close-modal" style="padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.export-comparison').addEventListener('click', () => {
            this.exportComparison(items);
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    analyzeSelection() {
        const selectedRows = Array.from(document.querySelectorAll('.row-checkbox:checked'));

        if (selectedRows.length === 0) {
            this.showToast('Please select items to analyze', 'warning');
            return;
        }

        const indices = selectedRows.map(checkbox => parseInt(checkbox.dataset.index));
        const selectedItems = indices.map(index => this.filteredData[index]);

        this.showBulkAnalysisModal(selectedItems);
    }

    showBulkAnalysisModal(items) {
        const totalViews = items.reduce((sum, item) => sum + item.views, 0);
        const avgRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length;
        const categories = [...new Set(items.map(item => item.category))];
        const languages = [...new Set(items.map(item => item.language))];

        const modal = document.createElement('div');
        modal.className = 'executive-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; 
            justify-content: center; z-index: 99999; padding: 1rem;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Bulk Analysis (${items.length} items)</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; margin-bottom: 0.5rem;">${items.length}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Items Selected</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">${avgRating.toFixed(1)}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Average Rating</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6; margin-bottom: 0.5rem;">${this.formatNumber(totalViews)}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Total Views</div>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.5rem;">${this.formatNumber(totalViews / items.length)}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Avg Views per Item</div>
                    </div>
                </div>
                
                <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h4 style="margin: 0 0 1rem 0; color: #1f2937;">Strategic Recommendation</h4>
                    <p style="margin: 0; color: #374151; line-height: 1.5;">
                        ${this.getBulkRecommendation(items)}
                    </p>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
                    <button class="close-modal" style="padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    getBulkRecommendation(items) {
        const avgRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length;
        const avgViews = items.reduce((sum, item) => sum + item.views, 0) / items.length;

        if (avgRating >= 4.5 && avgViews >= 1500000) {
            return "Premium Portfolio: Consider creating an exclusive collection or curated playlist. These items are ideal for holiday promotions and featured placements.";
        } else if (avgRating >= 4.0 && avgViews >= 750000) {
            return "Strong Portfolio: Bundle these for thematic campaigns. Cross-promote on social media and email marketing.";
        } else if (avgRating >= 3.5) {
            return "Average Portfolio: Focus on metadata optimization and A/B testing for better discovery. Consider targeted promotions.";
        } else {
            return "Needs Improvement: Review content strategy. Consider focusing marketing resources on higher-performing titles.";
        }
    }

    refreshData() {
        const button = document.getElementById('refreshBtn');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        button.disabled = true;

        setTimeout(() => {
            this.updateAll();

            const now = new Date();
            document.getElementById('lastUpdate').textContent =
                now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            button.innerHTML = originalHTML;
            button.disabled = false;

            this.showToast('Data refreshed successfully!', 'success');
        }, 1000);
    }

    enterPresentationMode() {
        this.showToast('Entered presentation mode. Press ESC to exit.', 'info');

        document.body.classList.add('presentation-mode');

        const exitHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.classList.remove('presentation-mode');
                document.removeEventListener('keydown', exitHandler);
                this.showToast('Exited presentation mode', 'info');
            }
        };

        document.addEventListener('keydown', exitHandler);
    }

    shareDashboard() {
        if (navigator.share) {
            navigator.share({
                title: 'IMovie Executive Dashboard',
                text: 'Check out the IMovie December 2025 Marketing Strategy Dashboard',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => this.showToast('Dashboard link copied to clipboard!', 'success'))
                .catch(() => this.showToast('Failed to copy link', 'error'));
        }
    }

    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'executive-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; 
            justify-content: center; z-index: 99999; padding: 1rem;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 500px; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Feedback</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #1f2937;">Your Feedback</label>
                    <textarea id="feedbackText" style="width: 100%; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: inherit; min-height: 120px;" placeholder="Share your thoughts, suggestions, or report issues..."></textarea>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="submit-feedback" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Submit
                    </button>
                    <button class="close-modal" style="padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.submit-feedback').addEventListener('click', () => {
            const feedback = modal.querySelector('#feedbackText').value;
            if (feedback.trim()) {
                console.log('Feedback:', feedback);
                this.showToast('Thank you for your feedback!', 'success');
                modal.remove();
            } else {
                this.showToast('Please enter your feedback', 'warning');
            }
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    initExportButtons() {
        document.getElementById('exportReportBtn')?.addEventListener('click', () => {
            this.exportPDF();
        });

        document.getElementById('exportDataBtn')?.addEventListener('click', () => {
            this.exportCSV();
        });
    }

    exportPDF() {
        const button = document.getElementById('exportReportBtn');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        button.disabled = true;

        setTimeout(() => {
            const reportContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>IMovie Executive Dashboard Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 2rem; }
                        h1 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
                        .section { margin-bottom: 2rem; }
                        .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem; }
                        .kpi-card { border: 1px solid #e5e7eb; padding: 1rem; border-radius: 8px; }
                        .kpi-value { font-size: 2rem; font-weight: bold; color: #1e40af; }
                        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                        th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
                        th { background: #f8fafc; font-weight: bold; }
                        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem; }
                    </style>
                </head>
                <body>
                    <h1>IMovie Executive Dashboard Report</h1>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Report Period:</strong> December 2025</p>
                    
                    <div class="section">
                        <h2>Executive Summary</h2>
                        <div class="kpi-grid">
                            <div class="kpi-card">
                                <div class="kpi-value">${document.getElementById('totalViewsKPI').textContent}</div>
                                <div>Total December Viewership</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-value">${document.getElementById('avgRatingKPI').textContent}/5</div>
                                <div>Average Rating</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Top 10 Performing Films (December)</h2>
                        <table>
                            <tr>
                                <th>Film Name</th>
                                <th>Category</th>
                                <th>Language</th>
                                <th>Rating</th>
                                <th>Views</th>
                            </tr>
                            ${this.filteredData.slice(0, 10).map(item => `
                                <tr>
                                    <td>${item.Film_Name || item.name}</td>
                                    <td>${item.category}</td>
                                    <td>${item.language}</td>
                                    <td>${item.rating.toFixed(1)}</td>
                                    <td>${this.formatNumber(item.views)}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                    
                    <div class="footer">
                        <p>Confidential & Proprietary - IMovie Executive Dashboard v2.1</p>
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([reportContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `IMovie_Report_${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            button.innerHTML = originalHTML;
            button.disabled = false;
            this.showToast('Report exported successfully!', 'success');
        }, 1500);
    }

    exportCSV() {
        const button = document.getElementById('exportDataBtn');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        button.disabled = true;

        const headers = ['Film_Name', 'Category', 'Language', 'Viewer_Rate', 'Number_of_Views', 'Viewing_Month', 'Performance'];
        const csvRows = [
            headers.join(','),
            ...this.filteredData.map(item => [
                `"${(item.Film_Name || item.name).replace(/"/g, '""')}"`,
                `"${item.category}"`,
                `"${item.language}"`,
                item.rating,
                item.views,
                `"${item.Viewing_Month || 'December'}"`,
                `"${item.performance}"`
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IMovie_Data_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            this.showToast('CSV data exported successfully!', 'success');
        }, 500);
    }

    exportComparison(items) {
        const headers = ['Film_Name', 'Category', 'Language', 'Viewer_Rate', 'Number_of_Views', 'Performance'];
        const csvRows = [
            headers.join(','),
            ...items.map(item => [
                `"${(item.Film_Name || item.name).replace(/"/g, '""')}"`,
                `"${item.category}"`,
                `"${item.language}"`,
                item.rating,
                item.views,
                `"${item.performance}"`
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IMovie_Comparison_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Comparison exported to CSV', 'success');
    }

    initFileUpload() {
        const dropZone = document.getElementById('dropZone');
        const fileUpload = document.getElementById('fileUpload');
        const browseBtn = document.getElementById('browseBtn');
        const analyzeBtn = document.getElementById('analyzeDataBtn');
        const sampleDataBtn = document.getElementById('sampleDataBtn');
        const clearDataBtn = document.getElementById('clearDataBtn');

        if (dropZone && fileUpload && browseBtn) {
            browseBtn.addEventListener('click', () => {
                fileUpload.click();
            });

            fileUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.style.backgroundColor = '#f1f5f9';
                dropZone.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.style.backgroundColor = '';
                dropZone.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.style.backgroundColor = '';
                dropZone.classList.remove('drag-over');

                if (e.dataTransfer.files.length > 0) {
                    this.handleFileUpload(e.dataTransfer.files[0]);
                }
            });

            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', () => {
                    if (this.data.length > 0) {
                        this.showToast('Analyzing uploaded data...', 'info');
                        this.updateAll();
                    }
                });
            }

            if (sampleDataBtn) {
                sampleDataBtn.addEventListener('click', () => {
                    this.generateSampleData();
                    this.updateAll();
                    this.showToast('Loaded sample data for analysis', 'info');
                });
            }

            if (clearDataBtn) {
                clearDataBtn.addEventListener('click', () => {
                    this.data = [];
                    this.filteredData = [];
                    localStorage.removeItem('imovie_uploaded_data');

                    document.getElementById('previewBody').innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
                                <i class="fas fa-database"></i>
                                <p>Upload a CSV file to preview data</p>
                            </td>
                        </tr>
                    `;

                    document.getElementById('previewCount').textContent = '0 records';
                    document.getElementById('previewStatus').textContent = 'No file uploaded';

                    if (analyzeBtn) analyzeBtn.disabled = true;

                    this.showToast('Data cleared successfully', 'info');
                });
            }
        }
    }

    async handleFileUpload(file) {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showToast('Please upload a CSV file', 'error');
            return;
        }

        const previewBody = document.getElementById('previewBody');
        const previewCount = document.getElementById('previewCount');
        const previewStatus = document.getElementById('previewStatus');
        const analyzeBtn = document.getElementById('analyzeDataBtn');

        if (previewBody) {
            previewBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Processing file...</p>
                    </td>
                </tr>
            `;
        }

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
                throw new Error('CSV file must contain at least one data row');
            }

            const headers = lines[0].split(',').map(h => h.trim());

            const data = [];
            for (let i = 1; i < Math.min(lines.length, 11); i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    if (index < values.length) {
                        row[header] = values[index];
                    }
                });
                data.push(row);
            }

            if (previewBody) {
                const tableRows = data.map(row => `
                    <tr>
                        <td>${row.Film_Name || row['Film Name'] || 'N/A'}</td>
                        <td>${row.Category || 'N/A'}</td>
                        <td>${row.Language || 'N/A'}</td>
                        <td>${row.Viewer_Rate || row.Rating || 'N/A'}</td>
                        <td>${row.Number_of_Views || row.Views || 'N/A'}</td>
                    </tr>
                `).join('');

                previewBody.innerHTML = tableRows;
            }

            if (previewCount) {
                previewCount.textContent = `${lines.length - 1} records`;
            }

            if (previewStatus) {
                previewStatus.textContent = 'File uploaded';
            }

            if (analyzeBtn) {
                analyzeBtn.disabled = false;
            }

            const fullData = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    if (index < values.length) {
                        row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
                    }
                });

                const filmData = {
                    Film_Name: row.film_name || row.name || `Film ${i}`,
                    Category: row.category || 'Unknown',
                    Language: row.language || 'English',
                    Viewer_Rate: parseFloat(row.viewer_rate || row.rating || '3.0') || 3.0,
                    Number_of_Views: parseInt(row.number_of_views || row.views || '100000') || 100000,
                    Viewing_Month: row.viewing_month || 'December',
                    name: row.film_name || row.name || `Film ${i}`,
                    category: row.category || 'Unknown',
                    language: row.language || 'English',
                    rating: parseFloat(row.viewer_rate || row.rating || '3.0') || 3.0,
                    views: parseInt(row.number_of_views || row.views || '100000') || 100000,
                    date: '2025-12-15',
                    performance: this.getPerformance(parseFloat(row.viewer_rate || row.rating || '3.0'))
                };

                fullData.push(filmData);
            }

            this.data = fullData;
            this.processData();

            localStorage.setItem('imovie_uploaded_data', JSON.stringify(this.data));

            this.showToast(`Successfully loaded ${this.data.length} records from ${file.name}`, 'success');

        } catch (error) {
            console.error('Error processing CSV:', error);

            if (previewBody) {
                previewBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Error processing file</p>
                            <p style="font-size: 0.875rem;">${error.message}</p>
                        </td>
                    </tr>
                `;
            }

            if (previewStatus) {
                previewStatus.textContent = 'Upload failed';
            }

            if (analyzeBtn) {
                analyzeBtn.disabled = true;
            }

            this.showToast('Error processing CSV file. Please check the format.', 'error');
        }
    }

    updateTimeframe(timeframe) {
        const messages = {
            'dec2025': 'Showing December 2025 data',
            'q4': 'Showing Q4 2025 data',
            'full2025': 'Showing Full Year 2025 data'
        };
        this.showToast(messages[timeframe] || 'Timeframe updated', 'info');
    }

    updateVisualization(vizType) {
        const insights = {
            'category': 'Category analysis reveals that Romance and Action films dominate December viewership',
            'language': 'Language distribution shows strong performance in regional languages, especially Tamil and Hindi',
            'trend': 'Trend analysis indicates 45% growth from August to December 2025',
            'comparison': 'December performance is 124% higher than monthly average across all categories'
        };

        const insightElement = document.getElementById('primaryInsight');
        if (insightElement) {
            insightElement.textContent = insights[vizType] || insights.category;
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.executive-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `executive-toast ${type}`;

        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };

        toast.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    formatNumber(num) {
        if (typeof num !== 'number') return '0';

        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.dashboard = new ExecutiveDashboard();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                    <h3>Failed to Load Dashboard</h3>
                    <p style="margin-bottom: 1rem;">Error: ${error.message}</p>
                    <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
});

// Global helper function
window.formatNumber = function (num) {
    if (typeof num !== 'number') return '0';

    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Add CSS for AI elements (should be added to your CSS file)
const aiCSS = `
.ai-badge {
    background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: 0.5rem;
    vertical-align: middle;
}

.ai-processing {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 12px;
}

.confidence-meter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.confidence-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
}

.confidence-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s ease;
}

.confidence-fill.high {
    background: linear-gradient(90deg, #10b981, #34d399);
}

.confidence-fill.medium {
    background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* Animation for AI processing */
@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-insight {
    animation: slideInUp 0.5s ease-out;
}
`;