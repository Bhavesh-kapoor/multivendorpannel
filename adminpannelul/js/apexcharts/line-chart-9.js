(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [90, 35, 41],
            chart: {
            type: 'donut',
            height: 423,
          },
          plotOptions: {
            pie: {
              startAngle: -100,
              endAngle: 100,
              offsetY: 0
            }
          },
          grid: {
            padding: {
              bottom: -80
            }
          },
          responsive: [{
            breakpoint: 991,
            options: {
              chart: {
                height: 300
              },
            }
          }],
          legend: {
            show: false,
          }
        };

        chart = new ApexCharts(
          document.querySelector("#line-chart-9"),
          options
        );
        if ($("#line-chart-9").length > 0) {
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