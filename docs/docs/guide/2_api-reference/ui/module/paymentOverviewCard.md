# Payment Overview Cards

### Add a custom payment method overview card in settings

Starting with Shopware 6.4.14.0, you can render a custom card in the new payment method overview.
With that, you can replace the default card, where you can toggle the active state of a payment method, with your own component.
This allows you, for example, to require an onboarding to your payment provider before activating the payment method.

### Parameters
| Name                    | Required | Default        | Description                                                                                                                         |
|:------------------------|:---------| :------------- |:------------------------------------------------------------------------------------------------------------------------------------|
| `positionId`            | true     |                | The position id that is created in the payment overview, where you can add a component section to                                   |
| `paymentMethodHandlers` | true     |                | A list of formatted payment method handlers, which are handled by your component and where the default card should not be rendered. |
| `component`             | false    |                | The component name of you custom payment overview card. Only useful, if you have a plugin with a registered component               |

### Extension example
```ts
import { ui } from '@shopware-ag/admin-extension-sdk';

if (sw.location.is(sw.location.MAIN_HIDDEN)) {
  // create the position
  ui.module.payment.overviewCard.add({
    positionId: 'my-custom-payment-overview-position',
    paymentMethodHandlers: [
      'handler_my_custom_payment_method_one',
      'handler_my_custom_payment_method_two', 
      // ...
    ],
  });
    
  // add your component to that position
  ui.componentSection.add({
    component: 'card',
    positionId: 'my-custom-payment-overview-position',
    props: {
      title: 'My payment provider',
      subtitle: 'We have all the methods that exist',
      locationId: 'my-custom-payment-overview-position-before'
    }
  })
}

// render your view to that location
if (sw.location.is('my-custom-payment-overview-position-before')) {
  // your content here
}
```

### Custom plugin component example
```ts
import { ui } from '@shopware-ag/admin-extension-sdk';

// register a custom component
Component.register('my-custom-payment-overview-card', {
  template: ``,// your template here
  props: {
    paymentMethods: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async changePaymentMethodActive(paymentMethod) {
      paymentMethod.active = !paymentMethod.active;

      this.$emit('set-payment-active', paymentMethod);
    },
  },
});

// add that component to the payment overview
ui.module.payment.overviewCard.add({
  component: 'my-custom-payment-overview-card',
  positionId: 'my-custom-payment-overview-position',
  paymentMethodHandlers: [
    'handler_my_custom_payment_method_one',
    'handler_my_custom_payment_method_two',
    // ...
  ],
});
```
