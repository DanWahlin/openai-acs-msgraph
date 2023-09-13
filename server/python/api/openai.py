from flask import Blueprint, jsonify, request
import json
import openai 
import os

openai.api_key = os.environ["OPENAI_API_KEY"]

# Create a Blueprint for the API routes
openai_api = Blueprint('openai_api', __name__)

async def call_openai(system_prompt, user_prompt, temperature):
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo", 
    messages=[
      {"role": "system", "content": system_prompt},  
      {"role": "user", "content": user_prompt}
    ],
    temperature=temperature, 
    max_tokens=1024
  )
  
  return response.choices[0].message.content



@openai_api.route('/completeEmailSmsMessages', methods=['POST'])
async def complete_email_sms_messages():
  data = request.json
  
  # Retrieve the values
  prompt = data.get('prompt')
  company = data.get('company')
  contact_name = data.get('contact_name')
  print("Inputs:", prompt, company, contact_name)

  system_prompt = f'''
  Assistant is a bot designed to help users create email and SMS messages from data and return a JSON object with the email and SMS message information in it. Rules:
  - Generate a subject line for the email message.
  - Use the User Rules to generate the messages. 
  - All messages should have a friendly tone and never use inappropriate language.
  - SMS messages should be in plain text format and NO MORE than 160 characters.
  - Start the message with "Hi {contact_name},\n\n". Contact Name can be found in the user prompt.
  - Add carriage returns to the email message to make it easier to read.
  - End with a signature line that says "Sincerely,\nCustomer Service".
  - Return a valid JSON object with the emailSubject, emailBody, and SMS message values in it: 
    {{
      "emailSubject": "",
      "emailBody": "", 
      "sms": ""
    }}
  - The sms property value should be in plain text format and NO MORE than 160 characters.
  - Only return a valid JSON object. Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. Just the JSON object is needed.
  '''
  
  user_prompt = f'''
    User Rules: {prompt}
    Contact Name: {contact_name}
  '''

  content = {
    "status": True,
    "error": ""
  }

  results = ""
  
  try:
    results = await call_openai(system_prompt, user_prompt, 0.5)
    print(results)
    if results:
      parsed_results = json.loads(results)
      content = {**content, **parsed_results, "status": True}
      jsonify(content)
      
  except Exception as e:
    print(e)
    content["status"] = False
    content["error"] = results
  
  return content
