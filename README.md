
# Solve Intelligence AI Engineer Challenge

## Objective

The objective of this challenge was to accomplish 3 primary tasks - 
1. Implementing Document Versioning
2. Incorporating Real-Time AI Suggestions
3. Adding additional AI functionality

## Setup

Make sure you create a .env file with a valid OpenAI API key. 
There are 2 ways of running the application -

 1. To build and run the application using Docker, execute the following command:
	```
	docker-compose up --build
	```
 2. To manually start the services in your terminal, follow the steps below:
	 1. start the client service in a terminal by running the commands below:
		```
		cd ./client
		npm install
		npm run dev
		```
	2. start the server in another terminal by running the commands below:
		```
		cd ./server
		pip install -r requirements.txt
		python -m uvicorn app.__main__:app --host 0.0.0.0 --reload
		```
		It's suggested to activate a virtual environment before installing all python dependencies.
## Task 1: Implement Document Versioning

I have implemented the concept of **versioning**. Users now have:
1. The ability to create new versions
2. The ability to switch between existing versions
3. The ability to make changes to any of the existing versions and save those changes (without creating a new version)

The following changes have been made to the starter code:
|Frontend|Backend  |
|--|--|
| A dropdown for both - Patent and Version is available now | DB schema is changed and a new column "version" is introduced. Columns "id" and "version" together serve as the joint primary key for the table |
| Clicking on the **Get Patent** button fetches the patent from the backend | Changes to the fetch and save APIs have been made based on the new version column |
| A button to **Create New Version** is available now on the right side | 2 new API endpoints to fetch all versions and create a new version are also exposed |
| User has two ways of creating a new version - create a blank draft, or copy the existing draft |  |

![screenshot of new version creation](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/versioning.png)

![screenshot of version control system](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/create_new_version.png)


## Task 2: Incorporating Real-Time AI Suggestions

Your colleague started some work on integrating real-time improvement suggestions for your users. However, they only had time to set up a WebSocket connection. It is your job to finish it.

You will find a WebSocket endpoint that needs to be completed in the `app/__main__.py` file in the `server`. This endpoint should receive the editor contents from the client and stream out AI suggestions to the UI. There are a few complications here:

- You are using a third party AI library, which exposes a fairly poor API. The code for this library is in `server/app/internal/ai.py`.
  - The API expects a **plain** text document, with no HTML mark-up or formatting
  - There are intermittent errors in the formatting of the JSON output

You will need to find some way of notifying the user of the suggestions generated. As we don't want the user's experience to be impacted, this should be a background process. You can find the existing frontend WebSocket code in `client/src/Document.tsx`.

## Task 3: Adding additional AI functionality

Implement an additional AI-based feature or product improvement that would benefit our customers as they draft their patent applications.

This last part is open-ended, and you can take it in any direction you like. We’re interested in seeing how you come up with and implement AI-based approaches without us directing you.

Some ideas:
- Generate technical drawings (e.g. flowcharts, system diagrams, device diagrams, etc.) based on the claims.
- Have the user ask the AI to make an update to the application, and have the AI stream this update directly into the editor.
- Extend task 2 by having the AI incorporate its suggestions directly into the editor.

Or anything else you like.

Enjoy!
