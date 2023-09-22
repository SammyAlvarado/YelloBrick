import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import googleAnalyticsService from "services/googleAnalyticsService";
import PropTypes from "prop-types";
import debug from "sabio-debug";
const _logger = debug.extend("UsersByCountry");

const UsersByCountry = ({ title }) => {
  const [data, setData] = useState({
    countryRow: [],
  });
  const countryCountRequest = {
    startDate: "30daysAgo",
    endDate: "today",
    metrics: [
      {
        name: "totalUsers",
      },
    ],
    dimensions: [
      {
        name: "country",
      },
      {
        name: "browser",
      },
    ],
  };
  useEffect(() => {
    googleAnalyticsService
      .analyticsRequest(countryCountRequest)
      .then(countryCountRequestSuccess)
      .catch(countryCountRequestError);
  }, []);
  const countryCountRequestSuccess = (result) => {
    setData((prevState) => {
      let data = { ...prevState };
      data.countryRow = numberFormatter(
        result.item.rows.map(resultMetricMapper)
      );
      return data;
    });
  };
  const countryCountRequestError = (error) => {
    _logger("Error Country Count result", error);
  };
  function resultMetricMapper(item, index) {
    return (
      <tr key={"$/" + index}>
        <td className="border-top-0 bg-white">
          <span className="align-middle ">{item.dimensionValues[0].value}</span>
        </td>
        <td className="border-top-0 bg-white">
          <span className="align-middle ">{item.dimensionValues[1].value}</span>
        </td>
        <td className="text-start border-top-0  bg-white">
          {item.metricValues[0].value}
        </td>
      </tr>
    );
  }
  function numberFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  }
  return (
    <Card className="h-100">
      <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center bg-primary">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body className="p-0 bg-white">
        <div className="table-responsive">
          <Table className="mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Browser</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody>{data.countryRow}</tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

UsersByCountry.propTypes = {
  title: PropTypes.string,
};

export default UsersByCountry;
