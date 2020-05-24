---
to: <%= outputFilePath %>
---
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('<%= featureFilePath %>');

defineFeature(feature, test => {<%
JSON.parse(feature).scenarios.forEach(function(scenario) { %>
    test('<%= scenario.label %>', ({ <%= JSON.parse(stops).join(', ') %> }) => {<% if (scenario.dataTable) { %>
        const dataTable = <%- JSON.stringify(scenario.dataTable, null, 4) %><% }
scenario.stops.forEach(function(stop) { %>
        <%= stop.stop %>('<%= stop.label %>', () => {<% if (scenario.dataTable && scenario.dataTable[stop.label]) { %>
            const data = dataTable[`<%= stop.label %>`];<% } %>
        });<% }) %>
    });<% }) %>
});
