(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [{
            name: 'Item 01',
            data: [51, 40, 58, 51, 42, 89, 80, 51, 60, 78, 81, 92]
          }, {
            name: 'Item 02',
            data: [31, 32, 45, 32, 34, 52, 41, 31, 40, 28, 51, 42]
          }, {
            name: 'Item 03',
            data: [21, 22, 35, 22, 24, 42, 31, 21, 30, 18, 41, 30]
          }],
            chart: {
            height: 160,
            type: 'line',
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false,
          },
          colors: ['#FB923C', '#93C5FD', '#F87171'],
          stroke: {
            curve: 'smooth',
            width: 1,
          },
          yaxis: {
            show: false,
          },
          xaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
            categories: ["12:00", "12:00","13:00", "13:00","14:00", "14:00","15:00", "15:00","16:00", "16:00","17:00", "17:00" ]
          },
          tooltip: {
            x: {
              format: 'dd/mm/yy'
            },
          },
          };

        chart = new ApexCharts(
          document.querySelector("#line-chart-15"),
          options
        );
        if ($("#line-chart-15").length > 0) {
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