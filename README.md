# Channel Status Notifier

CSN (Channel Status Notifier) is a serverless project using the Events Slack API. It fetches all the members of a specified Slack Channel, analyses their status (based on keyword first, then emoji), and produces an absence report for the day.

Absence categories include:

- On holiday
- Out of office (e.g. conference, training, etc.)
- Off sick
- Work from home
- On parental leave

Note: this report is dependent on members of the channel updating their Slack status regularly; and before the alert is triggered.

# Architecture

The app consists of two lambdas one triggered via api gateway which uses AWS sns to publish a message with the channel name that triggers the functionality. This is because the Slack events api has a 3 second timout function that sends anouther request if it does not get a response. This would cause double messages to be sent.

# Installation

Clone the repository. Then install the dependencies.

```
npm install
```

You can run the app locally using this command

```
serverless offline
```

To deploy the service make sure you have set up the correct permissions and IAM roles then run

```
serverless deploy
```

You will then be provided with the end point that you can use to integrate with the slack api.
