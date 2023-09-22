import axios from "axios";
import * as helper from "./serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("googleAnalyticsService");

const endpoint = `${helper.API_HOST_PREFIX}/api/analytics/`;

const analyticsRequest = (payload) => {
  _logger("Service Payload", payload);
  const config = {
    method: "POST",
    url: `${endpoint}data`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const googleAnalyticsService = { analyticsRequest };

export default googleAnalyticsService;
