curl -X POST -d '{
    "name":"QuickStartExport",
    "addressable":{
        "name":"HiveMQBroker",
        "protocol":"tcp",
        "address":"broker.hivemq.com",
        "port":1883,
        "publisher":"EdgeXExportPublisher",
        "topic":"EdgeXQuickStartGuide"
    },
    "format":"JSON",
    "filter":{
        "deviceIdentifiers":["Random-Integer-Generator01"]
    },
    "enable":true,
    "destination":"MQTT_TOPIC"
}' http://localhost:48071/api/v1/registration
