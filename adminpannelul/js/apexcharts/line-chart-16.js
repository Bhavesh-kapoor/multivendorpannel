(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [{
            name: 'Item 01',
            data: [
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
              81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120
            ]
          }],
            chart: {
            height: 160,
            type: 'bar',
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '11px',
            },
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false,
          },
          colors: '#E2E8F0',
          stroke: {
            show: false,
          },
          yaxis: {
            show: false,
          },
          xaxis: {
            labels: {
              show: false
            },
            axisTicks: {
              show: false
            },
            tooltip: {
              enabled: false
            }
          },
          tooltip: {
            x: {
              format: 'dd/mm/yy'
            },
          },
          };

        chart = new ApexCharts(
          document.querySelector("#line-chart-16"),
          options
        );
        if ($("#line-chart-16").length > 0) {
          chart.render();
        }
      };
  
      /* Function ============ */
      return {
        init: function () {},
  
        load: function () {
          chartBar();
        },
        resize: function () {},
      };
    })();
  
    jQuery(document).ready(function () {});
  
    jQuery(window).on("load", function () {
      tfLineChart.load();
    });
  
    jQuery(window).on("resize", function () {});
})(jQuery);