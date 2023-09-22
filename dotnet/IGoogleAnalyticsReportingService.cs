using Google.Analytics.Data.V1Beta;
using Sabio.Models.Requests.GoogleAnalyticsReportRequest;

namespace Sabio.Services
{
    public interface IGoogleAnalyticsReportingService
    {
        RunReportResponse GetReportResponse(GoogleAnalyticsReportRequest model);
    }
}
