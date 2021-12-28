# Positions

Extension developer can extend existing areas or create new areas in the administration. It is so flexible that there are way to many Id's to remember. To identify the positions which the developer want to extend we need a unique ID for every position. These Id's are the `positionId`s.

### Example:

A extension wants to add a new tab item to a tab-bar. In the administration are
many tab-bars available. So the developer needs to choose the correct `positionId` to tell the admin which tab-bar should be extended. In this example the developer adds a new tab item to the tab-bar in the product detail page.
```js
sw.ui.tabs('sw-product-detail').addTabItem({ ... })
```


### Vue Devtools Plugin for finding the PositionId's
It is impossible to create a list of all potential position Id's. And they would be hard to manage. To solve this problem the SDK provides a custom plugin for the Vue Devtools. It makes identifying the position Id's very easy.

Just open the plugin in the Devtools (It is available directly when you open the Administration). Then you can see all positions at the current administration view which are available for extending. If you click at one position Id you get more information about it. Like the property in the Admin-Extension-SDK so that you directly know what functionality this position has.

In summary: the Devtool plugin provides a visual way to see which parts can be extended and what are the positionIDs for the extension position. You can find a detailed guide in the tooling section of this documentation: [Vue Devtools](../3_tooling/vue-devtools.md)