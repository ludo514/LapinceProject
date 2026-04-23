<script>
    import { Pie } from 'svelte-chartjs';
    import "chart.js/auto";

    let { data } = $props();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    boxWidth: 18,
                    padding: 12
                }
            },
            tooltip: {
                bodyFont: {
                    size: 14
                },
                padding: 10,
                callbacks: {
                    label(context) {
                        return context.raw + " €";
                    }
                }
            }
        }
    };
</script>

<div class="mainGraph">
    <div class="graph">
        <Pie {data} {options} />
    </div>
</div>

<style>
    .mainGraph {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .graph {
        position: relative;
        width: min(95vw, 800px);
        height: 420px;
    }
</style>