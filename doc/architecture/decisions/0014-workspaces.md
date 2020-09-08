## Status

Date: 2020-03-09

## Attendees

- Wayne See
- Lucas Hills
- Briana Coppard
- David Allen
- Daniel Bradford
- Kari Matthews
- Alex Robinson
- Levi Serebryanski
- Tim Patullock
- Adrian Yong
- Apoorv Kansal

## Context

In building the new Sunco Messenger there are a number of issues we need to address.

1: We would like to be able to update npm packages in the new Messenger without also having to update the existing widget. When all the code is in a single repo there is no easy way to update some parts of it without updating all of it.
2: There is a potential product requirement to share the react Sunco components between teams. To be shareable these components would have to live externally from our Messenger codebase.
3: We want to be able to split up the codebase to enforce a proper separation of logic between the old and new components.
4: Achieve all the above requirements while maintaining an as easy as possible development experience.

## Solution

### yarn workspaces

[Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) allows for a mono repo where there are totally separate workspaces each with their own dependencies but all in the same repo.

This would address all the above mentioned issues:
1: We will be able to extract the Sunco Messenger code into a separate workspace allowing for independent dependency updates.
2: We will be able to extract the shareable components into their own workspace with a separate build process allowing them to be stored in a package registry.
3: By having the logic in separate workspaces it will enforce code separation.
4: Allows for easy local development without having to worry about the package versions and imports like you do for external packages.

#### Concerns

While this does seem the nicest way to solve the issues, there will definitely be many issues and problems to solve as we start using new tools that will affect our development, build, and deployment processors.

While there will be some technical challenges ensuring everything is set up and works correctly, none of them should prevent us from implementing this, as this is a common setup both in Zendesk and outside of Zendesk. At this time the biggest challenge would be justifying the resources and time needed to research and properly implement this. And will have to be weighed against other priorities.

### Steps to implement

- Update embeddable to yarn
  - install yarn
  - Update yarnrc.yml with zendesk npm scope
  - Authenticate locally using `yarn npm install`
  - Install yarn on samson (the existing authentication should work)
  - (Can split the story over here)
  - Update all the commands currently using npm to use yarn
- Use yarn workspaces
  - Update embeddable framework to use yarn workspaces
  - Will need to update the yarn commands to point at the workspace
  - May need to adjust some of the build and deploy logic to use the correct directories
- Move the sunco client into a separate workspace adjust build code if needed
- Create a workspace for shared packages
  - The ability to create and deploy and a simple component as a proof of concept
  - Start moving components into this directory
- Split out yarn messenger

### Alternative solution considered

**Separate repos:** We can move what we want to split out into separate repos. But it would be much harder to develop locally as well as to deploy when dealing with separate repos so this option is a non starter.

**npm workspaces** A possible alternative to yarn workspaces is npm workspaces but it is not yet available in the stable version of npm so won't be considered at this time.
