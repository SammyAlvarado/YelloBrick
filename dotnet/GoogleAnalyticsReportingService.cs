using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Analytics.Data.V1Beta;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Models;
using Sabio.Models.Requests.GoogleAnalyticsReportRequest;

namespace Sabio.Services
{
    public class GoogleAnalyticsReportingService : IGoogleAnalyticsReportingService
    {
        private IWebHostEnvironment _env;
        public GoogleAnalyticsReportingService(IWebHostEnvironment env)
        {
            _env = env;
            string keyPath = Path.Combine(_env.WebRootPath, "GoogleAnalytics", "google-analytics-credentials.json");

            BetaAnalyticsDataClient client = new BetaAnalyticsDataClientBuilder
            {
                CredentialsPath = keyPath,
            }.Build();
        }
        public RunReportResponse GetReportResponse(GoogleAnalyticsReportRequest model)
        {
            string keyPath = Path.Combine(_env.WebRootPath, "GoogleAnalytics", "google-analytics-credentials.json");
            string file = File.ReadAllText(keyPath);
            dynamic jsonFile = JsonConvert.DeserializeObject(file);
            string propertyId = jsonFile.property_id;

            BetaAnalyticsDataClient client = new BetaAnalyticsDataClientBuilder
            {
                CredentialsPath = keyPath,
            }.Build();

            RunReportRequest request = new RunReportRequest
            {
                Property = "properties/" + propertyId,
                DateRanges = { new Google.Analytics.Data.V1Beta.DateRange { StartDate = model.StartDate, EndDate = model.EndDate } },
                Metrics = { model.Metrics },
                Dimensions = { model.Dimensions },
            };

            var response = client.RunReport(request);

            return response;
        }
    }
}
