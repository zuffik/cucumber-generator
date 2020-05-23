---
to: <%= outputFilePath %>
---
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('<%= featureFilePath %>');

defineFeature(feature, test => {<%
JSON.parse(feature).scenarios.forEach(function(scenario) { %>
    test('<%= scenario.label %>', ({ <%= JSON.parse(stops).join(', ') %> }) => {<%
scenario.stops.forEach(function(stop) { %>
        <%= stop.stop %>('<%= stop.label %>', () => {
        });<% }) %>
    });<% }) %>
});
