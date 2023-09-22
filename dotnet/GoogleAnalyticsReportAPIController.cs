using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Services;
using Sabio.Web.Models.Responses;
using Sabio.Web.Controllers;
using Google.Analytics.Data.V1Beta;
using Sabio.Models.Requests.GoogleAnalyticsReportRequest;
using Amazon.Runtime.Internal.Util;
using Microsoft.Extensions.Logging;
using System;
using System.Composition;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/analytics")]
    [ApiController]
    public class GoogleAnalyticsReportAPIController : BaseApiController
    {
        private IGoogleAnalyticsReportingService _gaService = null;
        private IAuthenticationService<int> _authService = null;

        public GoogleAnalyticsReportAPIController(IGoogleAnalyticsReportingService service,
            ILogger<GoogleAnalyticsReportAPIController> logger,
            IAuthenticationService<int> authService) : base(logger) 
        {
            _gaService = service;
            _authService = authService;
        }

        [HttpPost("data")]
        public ActionResult<ItemResponse<RunReportResponse>> GetGoogleReportV2(GoogleAnalyticsReportRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                RunReportResponse report = _gaService.GetReportResponse(model);
                if (report == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Google Analytics information not found");
                }
                else
                {
                    response = new ItemResponse<RunReportResponse>()
                    {
                        Item = report
                    };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);

        }
    }
}
