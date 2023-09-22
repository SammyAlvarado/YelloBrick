import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import GoogleAnalyticsService from "services/googleAnalyticsService";
import ApexCharts from "./ApexCharts";
import debug from "sabio-debug";
import Icon from "@mdi/react";
import { mdiSquareRounded } from "@mdi/js";
import { OperatingSystemChartOptions } from "components/dashboard/analytics/ChartData";

const _logger = debug.extend("OSChart");

const OSChart = () => {
  const [data, setData] = useState({
    dimensionValuesMapped: [],
    metricValuesMapped: [],
    labelMapped: [],
  });

  const value2 = {
    startDate: "7daysAgo",
    endDate: "today",
    metrics: [
      {
        name: "totalUsers",
      },
    ],
    dimensions: [
      {
        name: "operatingSystem",
      },
    ],
  };

  useEffect(() => {
    GoogleAnalyticsService.analyticsRequest(value2)
      .then(analyticsRequest2Success)
      .catch(analyticsRequest2Error);
  }, []);

  function metricValuesMapResult(item) {
    return item.metricValues[0].value;
  }
  function dimensionValuesMapResult(item) {
    return OperatingSystemChartOptions.labels.push(
      item.dimensionValues[0].value
    );
  }
  function labelValuesMapResult(item, index) {
    let lableArray = item.dimensionValues[0].value;
    let colorName;
    if (lableArray === "Windows") {
      colorName = "text-danger";
    } else if (lableArray === "iOS") {
      colorName = "text-primary";
    } else if (lableArray === "Android") {
      colorName = "text-success";
    } else if (lableArray === "MacOs") {
      colorName = "text-primary";
    } else {
      colorName = "text-info";
    }

    return (
      <li className="list-inline-item mx-3" key={index}>
        <h5 className="mb-0 d-flex align-items-center fs-5 lh-1">
          <Icon
            path={mdiSquareRounded}
            className={`${colorName} fs-5 me-2`}
            size={0.6}
          />
          {item.dimensionValues[0].value}
        </h5>
      </li>
    );
  }

  const analyticsRequest2Success = (result) => {
    setData((prevState) => {
      let data = { ...prevState };
      data.metricValuesMapped = result.item.rows.map(metricValuesMapResult);
      data.dimensionValuesMapped = result.item.rows.map(
        dimensionValuesMapResult
      );
      data.labelMapped = result.item.rows.map(labelValuesMapResult);

      return data;
    });
  };
  const analyticsRequest2Error = (error) => {
    _logger("Error result", error);
  };

  return (
    <>
      <Card className="h-100">
        <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center bg-primary">
          <h4 className="mb-0">Operating System</h4>
        </Card.Header>
        <Card.Body className="bg-white">
          <ApexCharts
            options={OperatingSystemChartOptions}
            series={data.metricValuesMapped}
            type="polarArea"
            height={350}
          />
          <div className="mt-4 d-flex justify-content-center">
            <ListGroup as="ul" bsPrefix="list-inline" className="mb-0">
              {data.labelMapped}
            </ListGroup>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default OSChart;
