# 13. Folder structure for messenger

Date: 2020-07-02

## Attendees

- Adrian Yong
- Alex Robinson
- Briana Coppard
- David Allen
- Daniel Bradford
- Levi Serebryanski
- Lucas Hills
- Tim Patullock
- Wayne See

## Status

Approved

## Results

## Context

Our folder structure for the embeddable framework has evolved quite a bit over the past year as we have tried to group code by specific "classic Web Widget embed".

However, now that we will be introducing a completely new embeddable - the messenger, we need to decide on our approach to structuring the folders for the new embeddable.

To help visualise what sort of things we will be grouping, here are some mock files that is roughly close to what we will be using.

**Components**

- Launcher
- MessengerFrame
- Messenger
- useScrollBehaviour
- Header
- HeaderAvatar
- HeaderDescription
- company slice
- message slice

## Possible Approaches

### 1. Use the same structure as the "embed" folder

```
- actions
- components
  - Launcher
  - MessageFrame
  - Messenger
  - MessengerLog
  - MessengerAvatar
  - Header
  - HeaderAvatar
  - HeaderDescription
- hooks
  - useScrollBehaviour
- selectors
- store
  - company
  - message
```

#### Pros

##### Same as the classic Web Widget

This approach requires little thought and discussion from us, as its pretty much identical to what we have been working towards for the classic Web Widget.

#### Cons

##### Features are still spread across many files

Although redux toolkit will hopefully keep the actions/selectors/reducers mostly together, in the above example you can see that the message feature is spread out between the components, store and hooks folders.

### 2. Group by feature, add folders when needed

```
- components
  - Launcher
  - MessageFrame
- features
  - message-log
    - components
      - Messenger
      - MessengerLog
      - MessengerAvatar
    - useScrollBehaviour
    - message slice
  - header
    - Header
    - HeaderAvatar
    - HeaderDescription
  - company
    - company slice
- hooks

- store
```

For this option features are grouped in a feature folder and by default aren't nested in any further folders.

#### Pros

##### Avoid premature folder optimisation

In this example, the company is just a single redux slice and the header is just three components. Nesting them in `store` and `components` folders is arguably redundant.

##### Keeps features grouped together

In this example, we can be confident that everything to do with messages is grouped under the message-log feature folder, which helps prevent us having to jump around folders too much.

##### Allows us to see what "feels right"

This point is arguably a pro and a con. But by not having strict rules going in to this, we are given the chance to see what feels natural to us.

a.k.a http://react-file-structure.surge.sh/

#### Cons

##### Hard to define what is a feature and what isn't

In this example we have a company feature, but its just a single file. Should these be left in a top level `store` folder until they grow in complexity?

##### What happens when a feature gets too big?

The message-log feature might also include things like StructuredMessages, which is going to be a large piece of work. Should this be defined under the message-log feature or under its own structured-messages feature?

### 3. Group by feature, but keep nested folders

```
- components
  - Launcher
  - MessageFrame
- features
  - message-log
    - components
      - Messenger
      - MessengerLog
      - MessengerAvatar
    - hooks
        - useScrollBehaviour
    - store
      - message slice
  - header
    - components
      - Header
      - HeaderAvatar
      - HeaderDescription
  - company
    - store
      - company slice

```

This option is very similar to the previous one, however is much stricter about folder structures. Its treating the "features" folder kinda the same as the "embeds" folder in the classic Web Widget.

In this one, each feature folder follows the folder structure outline in option 1 from the start, regardless of how complex the feature is.

#### Pros

##### Less moving around of folders

If a feature grows in size, theres no question about if its time to split up the feature into sub folders.

#### Cons

##### Unnecessary nesting

I don't believe it will be uncommon to have instances where a feature is a combination of 1-2 components and 1 redux slice.

Forcing them to be nested under `components` and `store` folders just adds extra work and more folder jumping.

### 4. Co-locate files where it makes sense to do so

The issue we are trying to solve is to try and keep code in the one location where it makes sense to do so.

Since this will usually involve some components needing hooks or state, for this option the proposal is to just put that code alongside the page/component it is for.

```
- components
  - Launcher
  - MessageFrame
  - Messenger
    - MessengerLog
    - MessengerAvatar
    - useScrollBehaviour
    - message slice
  - Header
    - HeaderAvatar
    - HeaderDescription
- store
  - company slice
```

#### Pros

##### Same folder structure we are used to, just a small difference

For this option we can use the same folder structure as the "embeds" folder to provide the base level folders.

#### Cons

##### It may not always be clear when to move folders around

In the above example the message slice was put with the messenger. But what happens when a different component needs to use the same state?

At first it could be argued to leave it alongside the messenger, but at what point do we move the message slice out into the general "store" folder and not nested in the Messenger component?

## Decision

Option 3 - we liked that code was co-located under their feature folders and that each feature folder had consistent sub folders no matter how big they are.

For option 1 we had concerns around features being split between different folders and the top level components folder becoming very large since all components would go there.

For option 2, we had concerns around having to decide when to create folders, we didn't want the burden of having to always make that judgement call when we add to a feature.

For option 4, we also had concerns around having to make that judgement call around when it makes sense to leave in the component folder and when it makes sense to move it out of there.
