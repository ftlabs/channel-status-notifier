# Channel Status Notifier

CSN (Channel Status Notifier) is a small node script, running on AWS Lambda using the Events Slack API. It fetches all the members of a specified Slack Channel, analyses their status (based on keyword first, then emoji), and produces an absence report for the day.

Absence categories include:

- On holiday
- Out of office (e.g. conference, training, etc.)
- Off sick
- Work from home
- On parental leave

Note: this report is dependent on members of the channel updating their Slack status regularly; and before the alert is triggered.
