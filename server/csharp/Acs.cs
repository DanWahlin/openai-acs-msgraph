using Azure.Identity;
using Azure.Communication.Identity;
using Azure.Core;
using Azure.Communication;
using Azure.Communication.Sms;
using Azure.Communication.Email;
using Azure;
public class Acs {
    string connectionString = Environment.GetEnvironmentVariable("ACS_CONNECTION_STRING") ?? "";

    async Task<AcsToken> CreateACSToken()
    {
        if (string.IsNullOrEmpty(connectionString))
        {
            return new AcsToken() { UserId = "", Token = "" };
        }

        var tokenClient = new CommunicationIdentityClient(connectionString);
        var userResponse = await tokenClient.CreateUserAsync();
        var user = userResponse.Value;

        var tokenResponse = await tokenClient.GetTokenAsync(user, new[] { CommunicationTokenScope.VoIP });
        var userToken = tokenResponse.Value;

        return new AcsToken() { UserId = user.Id, Token = userToken.Token };
    }

    public async Task<EmailResult> SendEmail(string subject, string message, 
        string customerName, string customerEmailAddress) {
        if (string.IsNullOrEmpty(connectionString))
        {
            return new EmailResult() { Status = false, Id = "" };
        }
        var emailClient = new EmailClient(connectionString);
        try {
            var sendResult = await emailClient.SendAsync(
                wait: WaitUntil.Completed,
                senderAddress: Environment.GetEnvironmentVariable("ACS_EMAIL_ADDRESS") ?? "",
                recipientAddress: customerEmailAddress,
                subject: subject,
                htmlContent: message
            );
            return new EmailResult() { Status = true, Id = sendResult.Id };
        } catch (Exception ex) {
            Console.WriteLine(ex.Message);
            return new EmailResult() { Status = false, Id = "" };
        }
    }

    public async Task<SmsResult> SendSms(string message, string customerPhoneNumber) {
        var smsClient = new SmsClient(connectionString);

        try {
            var sendResults = await smsClient.SendAsync(
                from: Environment.GetEnvironmentVariable("ACS_PHONE_NUMBER"),
                to: customerPhoneNumber,
                message: message
            );
            return new SmsResult { Status = true, Id = sendResults.Value.MessageId, Error = "" };
        } catch (Exception ex) {
            Console.WriteLine(ex.Message);
            return new SmsResult { Status = false, Id = "", Error = ex.Message };
        }
    }
}

public class AcsToken {
    public string UserId { get; set; } = "";
    public string Token { get; set; } = "";
}

public class SmsResult {
    public bool Status { get; set; } = false;
    public string Id { get; set; } = "";
    public string Error { get; set; } = "";
}

public class EmailResult {
    public bool Status { get; set; } = false;
    public string Id { get; set; } = "";
    public string Error { get; set; } = "";
}

public class SendSmsRequest {
    public string Message { get; set; } = "";
    public string CustomerPhoneNumber { get; set; } = "";
}