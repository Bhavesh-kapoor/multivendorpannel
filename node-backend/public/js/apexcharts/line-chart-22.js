(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [{
            name: 'Website',
            data: [51, 40, 58, 51, 42, 89, 80, 51, 60, 78, 81, 92]
          }, {
            name: 'E-commerce',
            data: [31, 32, 45, 32, 34, 52, 41, 31, 40, 28, 51, 42]
          }],
            chart: {
            height: 373,
            type: 'area',
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
          colors: ['#8D79F6', '#2377FC'],
          stroke: {
            curve: 'smooth'
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
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          },
          tooltip: {
            x: {
              format: 'dd/mm/yy'
            },
          },
          };

        chart = new ApexCharts(
          document.querySelector("#line-chart-22"),
          options
        );
        if ($("#line-chart-22").length > 0) {
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