import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ApexCharts from "./ApexCharts";
import GoogleAnalyticsService from "services/googleAnalyticsService";
import debug from "sabio-debug";
import { SessionChartOptions } from "components/dashboard/analytics/ChartData";

const SessionsChart = () => {
  const _logger = debug.extend("SessionsChart");

  const [data, setData] = useState({
    averageSessionDurationData: [],
    screenPageViewsPerSessionData: [],
    sessionsPerUserData: [],
    dimensionValuesObject: {
      dimensionValuesMapped: [],
    },
    testData: [
      {
        name: "",
        data: [],
        colors: ["#754ffe"],
      },
      {
        name: "",
        data: [],
      },
      {
        name: "",
        data: [],
      },
    ],
  });

  const value = {
    startDate: "7daysAgo",
    endDate: "today",
    metrics: [
      {
        name: "averageSessionDuration",
      },
      {
        name: "screenPageViewsPerSession",
      },
      {
        name: "sessionsPerUser",
      },
    ],
    dimensions: [
      {
        name: "date",
      },
    ],
  };

  useEffect(() => {
    GoogleAnalyticsService.analyticsRequest(value)
      .then(analyticsRequestSuccess)
      .catch(analyticsRequestError);
  }, []);

  function mapObject(item) {
    return item;
  }
  function metricValues(item, index) {
    return parseFloat(item.metricValues[index].value).toFixed(1);
  }
  function metricMinValues(item, index) {
    let input = parseFloat(item.metricValues[index].value);
    var hours = parseInt(input) / 60;
    return hours.toFixed(1);
  }
  function formatDate(userDOB) {
    const dob = new Date(userDOB);

    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = dob.getDate();
    const monthIndex = dob.getMonth();
    return `${day} ${monthNames[monthIndex]}`;
  }

  function dimensionValues(item) {
    let dates = item.dimensionValues[0].value.toString();
    var date = dates.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    let dateFormated = formatDate(date);
    return SessionChartOptions.xaxis.categories.push(dateFormated);
  }

  const analyticsRequestSuccess = (result) => {
    let resultObject = Object.entries(result.item).map(mapObject);

    setData((prevState) => {
      let data = { ...prevState };
      data.testData[0].name =
        resultObject[1][1][0].name.toString() === "averageSessionDuration"
          ? "Session Duration"
          : "averageSessionDuration";
      data.testData[0].data = result.item.rows.map((n) =>
        metricMinValues(n, 0)
      );
      data.testData[1].name =
        resultObject[1][1][1].name.toString() === "screenPageViewsPerSession"
          ? "Page Views"
          : "screenPageViewsPerSession";
      data.testData[1].data = result.item.rows.map((n) => metricValues(n, 1));
      data.testData[2].name =
        resultObject[1][1][2].name.toString() === "sessionsPerUser"
          ? "Total Visits"
          : "sessionsPerUser";
      data.testData[2].data = result.item.rows.map((n) => metricValues(n, 2));
      data.dimensionValuesObject.dimensionValuesMapped =
        result.item.rows.map(dimensionValues);
      return data;
    });
  };
  const analyticsRequestError = (error) => {
    _logger("Error result", error);
  };

  return (
    <>
      <Card className="h-100">
        <Card.Header className="bg-primary">
          <h4 className="mb-0">Sessions</h4>
        </Card.Header>
        <Card.Body className="bg-white">
          <ApexCharts
            options={SessionChartOptions}
            series={data.testData}
            type="line"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default SessionsChart;
