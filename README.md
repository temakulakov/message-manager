# message-manager
The project contains 2 scripts that are used by the rabbitmq message broker with metrics, Prometheus, which reads these metrics and fills its database of series with them, grafana reads this data and thereby creates graphs. Everything works in docker, scripts are optional, you can run it separately.

# Install introdaction:

1.  ``` docker-compose up```

2. In Grafana import dashboard/dashboard.json file.
