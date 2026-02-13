from dotenv import load_dotenv
import os
from mistralai import Mistral

# Load .env file (default looks in current directory)
load_dotenv()

api_key = os.environ["MISTRAL_API_KEY"]
# print(api_key)

model = "mistral-medium-latest"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model= model,
    messages = [
        {
            "role": "user",
            "content": "What is the best French cheese? return 1 sentence plain text answer, no markdown, no emojis, no formatting",
        },
    ]
)

print(chat_response.choices[0].message.content)