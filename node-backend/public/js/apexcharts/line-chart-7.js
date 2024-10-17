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
          }, {
            name: 'Store',
            data: [21, 22, 35, 22, 24, 42, 31, 21, 30, 18, 41, 30]
          }],
            chart: {
            height: 523,
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
          colors: ['#8F77F3', '#FF5200', '#2377FC'],
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          },
          responsive: [{
            breakpoint: 991,
            options: {
              chart: {
                height: 400
              },
            }
          }],
          yaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
          },
          tooltip: {
            x: {
              format: 'dd/mm/yy'
            },
          },
        };

        chart = new ApexCharts(
          document.querySelector("#line-chart-7"),
          options
        );
        if ($("#line-chart-7").length > 0) {
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