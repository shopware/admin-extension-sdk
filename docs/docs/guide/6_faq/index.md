---
title: "FAQ"
---

# FAQ

## Can I use the same domain with subfolders for multiple apps?
No, for technical reasons, it is not possible to use the same domain with subfolders to host multiple apps. Each app must have its own separate domain.
The preferred solution is to use subdomains for each app. For example, you can use subdomains like "app-one.your-company.com", "app-two.your-company.com", and so on. Using subdomains allows you to have separate domains for each app, which avoids the technical limitations associated with using subfolders.

## How can I use components that resemble the original components in the administration?
While it is not possible to use the exact same components in the Shopware administration, there is a component library called Meteor Component Library that offers similar components. The Shopware administration components are not native Vue components because they have extension capabilities, Twig templates, and other features that cannot be directly used. However, by utilizing the Meteor Component Library, you can achieve a native look and feel for your app that seamlessly integrates with the original Shopware administration.

To access the Meteor Component Library, visit the following link: https://github.com/shopware/meteor-component-library