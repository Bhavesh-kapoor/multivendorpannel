(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
          series: [{
          name: 'Price',
          data: [
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68,135, 182, 76, 112, 199, 168, 49, 120
          ]
        }],
          chart: {
          type: 'bar',
          height: 170,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '3px',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false,
        },
        colors: '#FFD4B1',
        stroke: {
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
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val
            }
          }
        }
        };

        chart = new ApexCharts(
          document.querySelector("#line-chart-12"),
          options
        );
        if ($("#line-chart-12").length > 0) {
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