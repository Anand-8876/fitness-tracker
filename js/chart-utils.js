// ========================================
// FITNESS TRACKER - CHART UTILITIES
// ========================================

window.ChartUtils = {
    // Render a line chart on a canvas
    renderLineChart: function (canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = 300;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!data || data.length === 0) {
            ctx.fillStyle = options.textColor || '#666666';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Chart configuration
        const padding = { top: 30, right: 30, bottom: 50, left: 50 };
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;

        // Get min and max values
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;

        // Add some padding to the value range
        const paddedMin = minValue - valueRange * 0.1;
        const paddedMax = maxValue + valueRange * 0.1;
        const paddedRange = paddedMax - paddedMin;

        // Helper function to get Y position
        const getY = (value) => {
            return padding.top + chartHeight - ((value - paddedMin) / paddedRange) * chartHeight;
        };

        // Helper function to get X position
        const getX = (index) => {
            return padding.left + (index / (data.length - 1)) * chartWidth;
        };

        // Draw grid lines
        ctx.strokeStyle = options.gridColor || 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();

            // Y-axis labels
            const value = paddedMax - (paddedRange / gridLines) * i;
            ctx.fillStyle = options.textColor || '#e0e0e0';
            ctx.font = '12px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(1), padding.left - 10, y + 4);
        }

        // Draw line
        ctx.strokeStyle = options.lineColor || '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw gradient under the line
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // Draw filled area
        ctx.beginPath();
        ctx.moveTo(getX(0), canvas.height - padding.bottom);
        data.forEach((point, index) => {
            const x = getX(index);
            const y = getY(point.value);
            ctx.lineTo(x, y);
        });
        ctx.lineTo(getX(data.length - 1), canvas.height - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = getX(index);
            const y = getY(point.value);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        data.forEach((point, index) => {
            const x = getX(index);
            const y = getY(point.value);

            // Outer circle
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = options.lineColor || '#ffffff';
            ctx.fill();

            // Inner circle
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#000000';
            ctx.fill();

            // Date labels (show every other label if too many points)
            const showLabel = data.length <= 7 || index % 2 === 0;
            if (showLabel) {
                ctx.fillStyle = options.textColor || '#e0e0e0';
                ctx.font = '11px Inter';
                ctx.textAlign = 'center';

                const date = new Date(point.date);
                const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                ctx.save();
                ctx.translate(x, canvas.height - padding.bottom + 15);
                ctx.rotate(-Math.PI / 4);
                ctx.fillText(label, 0, 0);
                ctx.restore();
            }
        });

        // Y-axis label
        if (options.yLabel) {
            ctx.fillStyle = options.textColor || '#e0e0e0';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(15, padding.top + chartHeight / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(options.yLabel, 0, 0);
            ctx.restore();
        }
    },

    // Render a bar chart on a canvas
    renderBarChart: function (canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = 300;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!data || data.length === 0) {
            ctx.fillStyle = options.textColor || '#666666';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Chart configuration
        const padding = { top: 30, right: 30, bottom: 50, left: 50 };
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;

        // Get max value
        const maxValue = Math.max(...data.map(d => d.value));
        const paddedMax = maxValue * 1.1;

        // Bar width
        const barWidth = (chartWidth / data.length) * 0.7;
        const barSpacing = (chartWidth / data.length) * 0.3;

        // Draw bars
        data.forEach((item, index) => {
            const x = padding.left + (chartWidth / data.length) * index + barSpacing / 2;
            const barHeight = (item.value / paddedMax) * chartHeight;
            const y = padding.top + chartHeight - barHeight;

            // Gradient for bar
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, options.barColor || '#ffffff');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = options.textColor || '#e0e0e0';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, canvas.height - padding.bottom + 15);

            // Value on top
            ctx.fillText(item.value, x + barWidth / 2, y - 5);
        });
    }
};

// Make chart redraw on window resize
window.addEventListener('resize', () => {
    if (typeof renderWeightChart === 'function') {
        renderWeightChart();
    }
});
