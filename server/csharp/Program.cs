using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
LoadEnvironmentVariablesFromDotEnv(builder);
builder.Services.Configure<JsonSerializerOptions>(options =>
{
    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<OpenAI>();
builder.Services.AddSingleton<Acs>();

var app = builder.Build();
app.UseCors();
app.UsePathBase("/api");

app.MapPost("/sendSms", async (SendSmsRequest request, Acs acs) => {
    if (string.IsNullOrWhiteSpace(request.Message) || 
        string.IsNullOrWhiteSpace(request.CustomerPhoneNumber)) {
        return Results.BadRequest(new {
            status = false, 
            error = "The message and customerPhoneNumber parameters must be provided." 
        });
    }

    try {
        await acs.SendSms(request.Message, request.CustomerPhoneNumber);
        return Results.Ok(new {
            status = true, 
            messageId = ""
        });
    }
    catch (Exception ex) {
        Console.WriteLine(ex.Message);
        return Results.BadRequest(new {
            status = false, 
            messageId = ""
        });
    }
});

app.MapPost("/completeEmailSmsMessages", async (EmailSmsCompletionRequest request, OpenAI openAI) =>
{
    if (string.IsNullOrWhiteSpace(request.Prompt) || 
        string.IsNullOrWhiteSpace(request.Company) || 
        string.IsNullOrWhiteSpace(request.ContactName)) {
        return Results.BadRequest(new {
            status = false, 
            error = "The prompt, company, and contactName parameters must be provided." 
        });
    }

    EmailSmsResponse? result = null;
    try
    {
        result = await openAI.CompleteEmailSMSMessages(request.Prompt, request.Company, request.ContactName);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }

    return Results.Json(result);
});

app.MapPost("/completeBYOD", async (string prompt, OpenAI openAI) =>
{
    if (string.IsNullOrWhiteSpace(prompt)) {
        return Results.BadRequest(new {
            status = false, 
            error = "The prompt, company, and contactName parameters must be provided." 
        });
    }

    var result = "";
    try {
        result = await openAI.CompleteBYOD(prompt);

    }
    catch (Exception ex) {
        Console.WriteLine(ex.Message);
    }
    return Results.Json(result); 
});

app.Run("http://*:3000");

void LoadEnvironmentVariablesFromDotEnv(WebApplicationBuilder builder)
{
    var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env");

    if (!File.Exists(envPath)) {
        Console.WriteLine("No .env file found.");
        return;
    }

    var keyValuePairs = new Dictionary<string, string>();
    var lines = File.ReadAllLines(envPath);

    foreach (var line in lines)
    {
        var parts = line.Split('=', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length != 2) continue; // Not a valid line
        Environment.SetEnvironmentVariable(parts[0], parts[1]);
    }
}
