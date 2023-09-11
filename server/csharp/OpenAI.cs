using System.Text.Json;
using System.Text.RegularExpressions;
using Azure;
using Azure.AI.OpenAI;

public class OpenAI
{
    private readonly string OPENAI_API_KEY = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "";
    private readonly string OPENAI_ENDPOINT = Environment.GetEnvironmentVariable("OPENAI_ENDPOINT") ?? "";
    private readonly string OPENAI_MODEL = Environment.GetEnvironmentVariable("OPENAI_MODEL") ?? "";
    private readonly string OPENAI_API_VERSION = Environment.GetEnvironmentVariable("OPENAI_API_VERSION") ?? "";
    private readonly string AZURE_COGNITIVE_SEARCH_ENDPOINT = Environment.GetEnvironmentVariable("AZURE_COGNITIVE_SEARCH_ENDPOINT") ?? "";
    private readonly string AZURE_COGNITIVE_SEARCH_KEY = Environment.GetEnvironmentVariable("AZURE_COGNITIVE_SEARCH_KEY") ?? "";
    private readonly string AZURE_COGNITIVE_SEARCH_INDEX = Environment.GetEnvironmentVariable("AZURE_COGNITIVE_SEARCH_INDEX") ?? "";

    private async Task<string> GetAzureOpenAICompletion(string systemPrompt, string userPrompt, float temperature) {
        CheckRequiredEnvVars(new[] { 
            "OPENAI_API_KEY", 
            "OPENAI_ENDPOINT", 
            "OPENAI_MODEL"
        });

        var client = new OpenAIClient(new Uri(OPENAI_ENDPOINT), 
            new AzureKeyCredential(OPENAI_API_KEY));
        var options = new ChatCompletionsOptions()
        {
            MaxTokens = 1024,
            Temperature = temperature,
            Messages =
            {
                new ChatMessage(ChatRole.System, systemPrompt),
                new ChatMessage(ChatRole.User, userPrompt)
            }
        };
        try
        {
            var completion = await client.GetChatCompletionsAsync(OPENAI_MODEL, options);
            var content = completion.Value.Choices[0].Message.Content;
            Console.WriteLine($"Azure OpenAI Output: \n{content}");
            if (!string.IsNullOrWhiteSpace(content) && content.Contains("{") && content.Contains("}"))
            {
                content = ExtractJson(content);
            }
            return content;
        }
        catch (RequestFailedException e)
        {
            Console.WriteLine(e.Message);
            throw e;
        }
    }
    private async Task<string> GetAzureOpenAIBYODCompletion(string systemPrompt, string userPrompt, float temperature) {
        CheckRequiredEnvVars(new[] { 
            "OPENAI_API_KEY", 
            "OPENAI_ENDPOINT", 
            "OPENAI_MODEL", 
            "AZURE_COGNITIVE_SEARCH_ENDPOINT", 
            "AZURE_COGNITIVE_SEARCH_KEY", 
            "AZURE_COGNITIVE_SEARCH_INDEX" 
        });

        var client = new OpenAIClient(new Uri(OPENAI_ENDPOINT), 
            new AzureKeyCredential(OPENAI_API_KEY));
        var options = new ChatCompletionsOptions()
        {
            MaxTokens = 1024,
            Temperature = temperature,
            Messages =
            {
                new ChatMessage(ChatRole.System, systemPrompt),
                new ChatMessage(ChatRole.User, userPrompt)
            },
            AzureExtensionsOptions = new AzureChatExtensionsOptions() 
            {
                Extensions =
                {
                    new AzureCognitiveSearchChatExtensionConfiguration()
                    {
                        SearchEndpoint = new Uri(AZURE_COGNITIVE_SEARCH_ENDPOINT),
                        SearchKey = new AzureKeyCredential(AZURE_COGNITIVE_SEARCH_KEY),
                        IndexName = AZURE_COGNITIVE_SEARCH_INDEX,
                    },
                }
            }
        };
        try
        {
            var completion = await client.GetChatCompletionsAsync(OPENAI_MODEL, options);
            var completionMessage = completion.Value.Choices[0].Message;

            foreach (ChatMessage contextMessage in completionMessage.AzureExtensionsContext.Messages)
            {
                string contextContent = contextMessage.Content;
                try
                {
                    var contextMessageJson = JsonDocument.Parse(contextMessage.Content);
                    contextContent = JsonSerializer.Serialize(contextMessageJson, new JsonSerializerOptions()
                    {
                        WriteIndented = true,
                    });
                }
                catch (JsonException)
                {}
                Console.WriteLine($"Azure OpenAI BYOD Output: \n{contextMessage.Role}: {contextContent}");
            }

            var content = completionMessage.Content;
            Console.WriteLine($"Azure OpenAI BYOD Output: {content}");
            return content;
        }
        catch (RequestFailedException e)
        {
            Console.WriteLine(e.Message);
            throw e;
        }
    }

    private async Task<string> GetOpenAICompletion(string systemPrompt, string userPrompt, float temperature)
    {
        CheckRequiredEnvVars(new[] { "OPENAI_API_KEY" });

        var client = new OpenAIClient(OPENAI_API_KEY);
        var options = new ChatCompletionsOptions()
        {
            MaxTokens = 1024,
            Temperature = temperature,
            Messages =
            {
                new ChatMessage(ChatRole.System, systemPrompt),
                new ChatMessage(ChatRole.User, userPrompt)
            }
        };
        try
        {
            var completion = await client.GetChatCompletionsAsync("gpt-3.5-turbo", options);
            var content = completion.Value.Choices[0].Message.Content;
            if (!string.IsNullOrWhiteSpace(content) && content.Contains("{") && content.Contains("}"))
            {
                content = ExtractJson(content);
            }
            return content;
        }
        catch (RequestFailedException e)
        {
            Console.WriteLine(e.Message);
            throw e;
        }
    }


    private async Task<string> CallOpenAI(string systemPrompt, string userPrompt,
        float temperature = 0, bool useBYOD = false)
    {
        var isAzureOpenAI = !string.IsNullOrEmpty(OPENAI_API_KEY) && 
                            !string.IsNullOrEmpty(OPENAI_ENDPOINT) && 
                            !string.IsNullOrEmpty(OPENAI_MODEL);

        // if (isAzureOpenAI && useBYOD) {
        //     // Azure OpenAI + Cognitive Search: Bring Your Own Data
        //     return getAzureOpenAIBYODCompletion(systemPrompt, userPrompt, temperature);
        // }

        if (isAzureOpenAI) {
            // Azure OpenAI
            return await GetAzureOpenAICompletion(systemPrompt, userPrompt, temperature);
        }

        // OpenAI
        return await GetOpenAICompletion(systemPrompt, userPrompt, temperature);
    }


    public void CheckRequiredEnvVars(string[] requiredEnvVars)
    {
        foreach (var envVar in requiredEnvVars)
        {
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(envVar)))
            {
                throw new Exception($"Missing {envVar} in environment variables.");
            }
        }
    }

    private string ExtractJson(string content)
    {
        Regex regex = new Regex(@"\{(?:[^{}]|{[^{}]*})*\}");
        Match match = regex.Match(content);

        if (match.Success)
        {
            return match.Groups[0].Value;
        }
        else
        {
            return "";
        }
    }

    public async Task<string> CompleteBYOD(string userPrompt) {
        var systemPrompt = "You are an AI assistant that helps people find information.";
        return await CallOpenAI(systemPrompt, userPrompt, 0, true);
    }

    public async Task<EmailSmsResponse> CompleteEmailSMSMessages(string? prompt, string? company, string? contactName)
    {
        Console.WriteLine($"Inputs: {prompt}, {company}, {contactName}");

        var systemPrompt = @"
            Assistant is a bot designed to help users create email and SMS messages from data and 
            return a JSON object with the email and SMS message information in it.

            Rules:
            - Generate a subject line for the email message.
            - Use the User Rules to generate the messages. 
            - All messages should have a friendly tone and never use inappropriate language.
            - SMS messages should be in plain text format and NO MORE than 160 characters. 
            - Start the message with ""Hi <Contact Name>,\n\n"". Contact Name can be found in the user prompt.
            - Add carriage returns to the email message to make it easier to read. 
            - End with a signature line that says ""Sincerely,\nCustomer Service"".
            - Return a JSON object with the emailSubject, emailBody, and SMS message values in it:

            { ""emailSubject"": """", ""emailBody"": """", ""sms"": """" }

            User: ""Your order has been delayed""
            Assistant:  {
                ""emailSubject"": ""Your Order has been Delayed"",
                ""emailBody"": ""Hi [Customer Name], We wanted to inform you that there has been a delay in processing your order. We apologize for any inconvenience this may have caused. Sincerely, Customer Service"",
                ""sms"": ""Hi [Customer Name], we apologize but your order has been delayed. Contact us for any questions. Thanks!""
            }

            - The sms property value should be in plain text format and NO MORE than 160 characters. 
            - Only return a JSON object. Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. 
            Just the JSON object is needed.
      ";

        var userPrompt = $@"
            User Rules: 
            {prompt}

            Contact Name: 
            {contactName}
        ";

        var content = new EmailSmsResponse();
        string results = string.Empty;

        try
        {
            // Assuming you have a method called CallOpenAI which returns a Task<string>
            results = await CallOpenAI(systemPrompt, userPrompt, 0.5F);

            if (!string.IsNullOrEmpty(results))
            {
                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var parsedResults = JsonSerializer.Deserialize<EmailSmsResponse>(results, jsonOptions);
                if (parsedResults != null)
                {
                    content.EmailSubject = parsedResults.EmailSubject;
                    content.EmailBody = parsedResults.EmailBody;
                    content.Sms = parsedResults.Sms;
                    content.Status = true;
                }
            }
            else
            {
                Console.WriteLine("No results returned from OpenAI.");
                content.Status = false;
                content.Error = results;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            content.Status = false;
            content.Error = results;
        }

        return content;
    }
}

public class EmailSmsResponse
{
    public bool Status { get; set; } = true;
    public string EmailSubject { get; set; } = "";
    public string EmailBody { get; set; } = "";
    public string Sms { get; set; } = "";
    public string Error { get; set; } = "";
}

public class EmailSmsCompletionRequest
{
    public string? Prompt { get; set; }
    public string? Company { get; set; }
    public string? ContactName { get; set; }
}