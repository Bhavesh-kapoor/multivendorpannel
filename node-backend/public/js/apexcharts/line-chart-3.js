(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [
              {
                data: [20, 50, 7, 100, 30, 80, 100],
              },
            ],
            colors: ["#CBD5E1"],
            chart: {
              type: "area",
              maxWidth: 96,
              height: 28,
              sparkline: { enabled: !0 },
            },
            plotOptions: { bar: { columnWidth: "50%" } },
            xaxis: { crosshairs: { width: 1 } },
  
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",
              colors: undefined,
              width: 3,
              dashArray: 0,
            },
  
            tooltip: {
              fixed: { enabled: !1 },
              x: { show: !1 },
              y: {
                title: {
                  formatter: function (e) {
                    return "";
                  },
                },
              },
              marker: { show: !1 },
            },
            states: {
              hover: {
                filter: {
                  type: "none",
                  value: 0,
                },
              },
            },
        },

        chart = new ApexCharts(
          document.querySelector("#line-chart-3"),
          options
        );
        if ($("#line-chart-3").length > 0) {
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