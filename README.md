# message-manager
The project contains 2 scripts that are used by the rabbitmq message broker with metrics, Prometheus, which reads these metrics and fills its database of series with them, grafana reads this data and thereby creates graphs. Everything works in docker, scripts are optional, you can run it separately.

# Install introdaction:

1.  ``` docker-compose up```

2. In Grafana import dashboard/dashboard.json file.

Messaging messenger in the distribution system of the information security event monitoring center. The task was to store the data in the RabbitMQ message broker while it is being processed by the receiver components, when there is a heavy load in the communication channels between the components of the microservice architecture, drawing the broker’s work schedule on the Grafana web page. Docker was used for development, sender and receiver components are written in JavaScript
