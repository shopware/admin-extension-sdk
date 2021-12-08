# How it works

The Admin Extension SDK provides wrapper methods for a better development experience. It abstracts and hides the more
complex logic behind a simple API. This makes it easier for app and plugin developers to create their solutions and focus
on their business instead of caring about the technical details.

## Admin communication

Technically speaking, apps and plugins are communicating with the Administration via the [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). It is a secure communication channel between different windows. In most cases it will be used to communicate
from an iFrame to the main window or the other way around.

The Extension SDK works in the same way, but it uses a hybrid approach. Every method is callable within an iFrame and also
from the same window. This allows apps (within iFrames) and plugins (in the same window) to use the same API.

![postMessage communication](./assets/post-message-communication.png)

Normally the postMessage API is very limited and not easy to use. You merely can send string values from one window to
another. This isn't very handy during the development process. To provide a smoother experience, we wrote some helper methods that
make working with the postMessage API a breeze.

The helper methods can be found in the `channel` file. It holds different methods for easier communication. The most important ones are `send` and `handle`. They are responsible for sending and handling data.

Here is an example to give you a better understanding of how that works.

### Example workflow

Let's imagine that an app or plugin calls the `context.getLanguage` method from the Extension SDK:

```js
// from app/plugin
const language = await sw.context.getLanguage();
```

But what is happening in the background? The method is a wrapper for the `send` method in the `channel`. When you use it, it will call `send` with a predefined type:

```js
// from app/plugin
send('contextLanguage', {});
```

Each message has a unique type. The types are hidden from plugin and app developers and are only responsible for the underlying handling. Knowing the unique type we can tell what type of request there is in the Administration and what response it expects.

The `send` method is producing magic in the background now. It creates a data object with following properties:

```js
{
  _type: 'contextLanguage',
  _data: {},
  _callbackId: 'aRand0mGeneratedUniqueId'
}
```

The `_type` property is there to recognize the request type. The `_data` property is custom data that will be added by the app or plugin. E.g. the title, message or any more information available for a notification. The `_callbackId` is needed for the Administration to send back the data including an ID, so that the sender is able to recognize it and use the included data.

This object will be sent as a stringified JSON object to the Administration window via the postMessage API.

<!-- Additionally, it creates an event listener that is looking for a message with a matching callback ID. When the Administration sends a response back the listener can get the values and return them as a Promise value to the original callee of the `send` method. -->

Now let's have a look at what needs to happen on the side of the Administration.

```js
// at Administration
handle('contextLanguage', () => {
    return {
        languageId: Shopware.Context.api.languageId,
        systemLanguageId: Shopware.Context.api.systemLanguageId,
    };
});
```

It uses the `handle` method, which is also a helper method of the `channel`. You see now, that the type matches the sender type. And in the second argument it provides a method that returns the data.

This method reacts to every `contextLanguage` request and sends the data values back to the source of the request. It also creates an object that includes meta information which in turn are needed for the original `send` window:
```js
{
  _type: 'contextLanguage',
  _response: { languageId: '1a2b3c...', systemLanguageId: '9f8g7h...', },
  _callbackId: 'aRand0mGeneratedUniqueId'
}
```

The source that will send the request is adding a new event listener before sending the message. This event listener listens to all incoming messages and if any of these messages matches the type and the callback ID of the message sent, it will handle the data.

In our case it will in return get a stringified object that includes the language information. These will be parsed and returned to the first method call:

```js
// from app/plugin
const language = await sw.context.getLanguage();

// language = { languageId: '1a2b3c...', systemLanguageId: '9f8g7h...', }
```

And this is basically it! The app or plugin has now got the data from the Administration. It all just looks like a simple call, but there is a lot going on in the background.

## Sending methods
In normal cases you can't add methods to JSON objects which will get stringified. But in our case we are convinced it would make the many developers' lives much easier if they can also use their own methods in the calls.

To handle these edge-cases we are converting the methods to information objects like this:
```js
{
  __type__: '__function__',
  id: 'theUniqueFunctionId' // will be generated uniquely
}
```

The method will be saved in a `methodRegistry` where the unique ID can be used as an identifier.

The receiver of the object converts this object back to a method that triggers the original method. This can't be done directly, because we do not have direct access to the method. To solve this problem, we send a special postMessage call to the original source. This call contains all arguments of the method called and its unique ID:

```js
send('__function__', {
  args: args,
  id: id,
})
```

The sender gets the message back and executes the method with the matching ID and the given arguments. The return value will then be sent back to the converted method in the receiver.

This complex logic is also abstracted. To use it, just add methods to
the data. They will then be converted and handled automatically.