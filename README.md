

# AI Engineer Challenge

This is a project built with the following tech stack:

 - Frontend
	 - React+Vite framework
	 - Typescript
	 - Material UI (for UI components)
 - Backend
	 - FastAPI + SQLite DB
 - Design Inspiration
	 - Grammarly (for auto-suggestions)

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
| A dropdown for both - Patent and Version is available now (by default few versions have been pre-filled into the DB for both patents 1 and 2) | DB schema is changed and a new column "version" is introduced. Columns "id" and "version" together serve as the joint primary key for the table |
| Clicking on the **Get Patent** button fetches the patent from the backend | Changes to the fetch and save APIs have been made based on the new version column |
| A button to **Create New Version** is available now on the right side | 2 new API endpoints to fetch all versions and create a new version are also exposed |
| User has two ways of creating a new version - create a blank draft, or copy the existing draft |  |

![screenshot of new version creation](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/versioning.png)

![screenshot of version control system](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/create_new_version.png)


## Task 2: Incorporating Real-Time AI Suggestions


A real-time AI suggestive functionality is implementedto assist users with patent writing. Users now have:
1. The ability to view suggestions given by an AI model in real-time
2. The ability to have suggestions generated after every change of the draft

The following changes have been made to the starter code:
|Frontend|Backend  |
|--|--|
| On the event of draft change, AI powered auto-suggestions are triggered | Draft content is converted to plain text from html markup and sent to the websocket endpoint |
| All suggestions are shown in separate cards along with their description, type, and severity level (highlighted in tiny chips) | websocket endpoint fetches the suggestions asynchronously and send them back to the UI |
| Suggestions are flushed when user changes the draft again, switches to a different draft/version, or refreshes the page | JSON response is parsed and displayed on the UI |

![enter image description here](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/loading_suggestions.png)

![enter image description here](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/ai_suggestions.png)

## Task 3: Adding additional AI functionality

I have added an additional functionality of giving the user the ability to stream the AI-powered suggestions directly into the draft.

The following changes have been made to the starter code:
|Frontend|Backend  |
|--|--|
| For each suggestion, user has the option to either resolve (i.e. incorporate) or ignore (i.e. discard) that particular suggestion | Resolving a suggestions triggers a call to another websocket endpoint which is responsible for fetching the response from the AI model |
| If resolved, the modified draft with the suggestion replaces the old draft | A separate prompt has been written which asks the model to incorporate the suggestion into the document and return the modified document |

![enter image description here](https://github.com/vitthal-bhandari/AIEngineerCodingChallenge/blob/master/assets/resolve_suggestions.png)

## Shortcomings

Certain features could benefit with more availability of time - 

 1. The suto-suggestion reoslution feature is inconsistent and doesn't always give the correct results. This could be primarily due to poor prompt tuning. Perhaps better prompt can be used for generating correct response. 
 2. During incorporation of suggestions into the draft, corresponding section/paragraph could be highlighted for better visualization.
