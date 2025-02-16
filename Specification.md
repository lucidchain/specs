# Lucid Chain Wizard Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

## Revision History

|Version  | Date         | Notes                          |
|:------- |:------------ |:---------------------------    |
| 1.0     | 2025   | Initial service chain modeling version.               |

## Introduction

**Lucid Chain Wizard** provides a service chain modeling language that is capable of specify many service chains configurations such as its type or TTO calculus. LCW helps to
import and export service chains from ITop and redmine, and it can also give some detailed metrics about SLA compliance. In this page we will describe this language.

## What is a service chain

A service chain is a set of two or more organizations that are related to each other through at least one service, in which a series of agreements are involved through an SLA.
In this SLA we can specify TTO and TTR values. Once we have this structure, we can represent it in a yaml file and use it in ITop or Redmine using Lucid Chain WIzard.

Before we start introducing the yaml structure and all the possible options that it provides, we are going to describe some concepts:

+ Incident/request/issue: It is a need reported by a customer. It must be handled by an organization following its repective SLA rules. For us every term such as incident, service request, user request and so on will be treated and refered as ***"issue"***

+ TTO: It means Time To Ownership. It is the time it takes for a team or individual to be ***assigned*** to an issue after it has been created or its state changed.

+ TTR: It means Time To Resolve. It is the time it takes for an issue to be ***closed*** since it has been assigned to someone or a team.

## Specification

A **service chain model** description is a [YAML](http://yaml.org/spec) document with following structure. Note that primitive data types in the service chain model specification are based on the types supported by the [JSON-Schema Draft 4](http://json-schema.org/latest/json-schema-core.html#anchor8).

![Class diagram](classDiagram.png "service chain model class diagram")

## Type faceted

In service chains with type faceted we have a simplified incident management. In this type of service chains the customer created an issue for its provier. The issue is assigned to a team and later to a person. When this happens, TTO is calculated as the time between its creation and its asignation. Once TTO is calculated, we start to count TTR until the issue has been resolve. Although the issues have states, they are always associated with the same service. If during the issue management the provider organization has to pass the resposability to one of its providers, a new issue between them must be created. In these cases we can close or pause the original issue. This way of managing issues makes a bit difficult tracking whether the first provider or any of its providers are fullfiling the SLAs. However, it is simpler and easier to understand. Faceted chains usually are usefull when there are no third party services interacting with the client.

We can represent faceted service chains as a directed graph, where the edges always represent a new issue creation.

## Type state

In type state service chains issue management is more complex but it is more efficent to detect who is not passing SLAs. In type state when an issue is created it has an state, which is related to just one service. In case this service needs to pass the responsability to another, it does it using the same issue, but changing its state. TTO is calculated as the sum of time the issue is not assigned to an user or a team. In case ownership-type is state, TTO is the sum of the times between the issue changes to a new state until is assigned to a person. In case ownership-type is state+team, it is calculated as the sum of the times between the issue is assigned to a new team until is assigned to a person.
In type state service chains we must define initial and terminal services, because we can represent this chains as bidirectional graphs. At this point, the only way to determine where we can start or end the process is defining this flow. Here the edges means a issue changing its state. We also need to define an initial SLA, because issue creation is a special moment that just can be done once.

## Context

## Organization Objects

Each Organization defined in **orgs** section must contain the following atributes and schema.

### `Organization`  

| Field name  | Field type                        | Required/Optional  | Description  |  
|------------ |---------------------------------|------------------- |------------- |  
| code        | `String`                         | **Required**       | Unique identifier for the organization. |  
| name        | `String`                         | **Required**       | Name of the  organization. It must be unique |  
| teams       | [`Team[]`](#team)    | Optional       | List of all the teams of the organization involved in the chain. The organization must have teams in order to have services and be a client or a provider. |  
| services    | [`Service[]`](#service) | Optional       | List of services offered by the organization. The organization must have teams for its services. Moreover, services are required in order to be a provider|  

---

### `Team`  

It is necessary that we include x-redmine-profile property when importing a chain in redmine, and x-itop-profiles when importing a chain in ITop.

| Field name  | Field type                        | Required/Optional  | Description  |  
|------------ |---------------------------------|------------------- |------------- |  
| name        | `String`                         | **Required**       | Name of the team. |  
| x-redmine-profile | [`RedmineProfile`](#redmineprofile)                     | Optional       | Redmine profile associated with the team. |  
| x-itop-profiles     | [`ITopProfile[]`](#itopprofile) | Optional       | List of all ITop profiles associated with the team. |  
| members     | [`Member[]`](#member) | **Required**       | List of all the team members. |

---

### `RedmineProfile`  

Defines the possible redmine profiles for the users in the team. This profiles allows users to have privileges for managing issues and other acitivities inside redmine.  

**NOTE**: This privileges are inherited to all team members.

| Value  | Description  |  
|----------------------------- |------------------------------------ |  
| `FunctionalUser`  | It allows the members of the team to manage issues. |  
| `ITUser`  | Currently it does not provide any privileges. In the future it will do it |  

---

### `ITopProfile`

This values are the currently available on ITop defaultly. You can have some additional information in the following [link](https://www.itophub.io/wiki/page?id=3_2_0:customization:profiles)
Here we leave the ITop official documentation chart about profiles

**NOTE**: This privileges are inherited to all team members.

| Value                 | Description  |
|-------------------------|-------------|
| Administrator           | Has the rights on everything (bypassing any control). |
| Portal user             | Has the rights to access the user portal. People having this profile will not be allowed to access the standard application; they will be automatically redirected to the user portal. |
| Configuration Manager   | Person in charge of the documentation of the managed CIs. |
| Service Desk Agent      | Person in charge of creating incident reports. |
| Support Agent           | Person analyzing and solving the current incidents. |
| Problem Manager         | Person analyzing and solving the current problems. |
| Change Implementor      | Person executing the changes. |
| Change Supervisor       | Person responsible for the overall change execution. |
| Change Approver         | Person who could be impacted by some changes. |
| Service Manager         | Person responsible for the service delivered to the [internal] customer. |
| Document author         | Any person who could contribute to documentation. |
| Portal power user       | *(New in 2.0.1)* Users having this profile will have the rights to see all the tickets for a customer in the portal. Must be used in conjunction with other profiles (e.g. Portal User). |
| REST Services User      | *(New in 2.5.0)* User account with access to the REST Web Services. If the configuration setting `secure_rest_services` is set to `true` (which is the default), then only the user accounts having this profile are allowed to use the REST Web services. |

---

### `Member`  

| Field name  | Field type                        | Required/Optional  | Description  |  
|------------ |---------------------------------|------------------- |------------- |  
| name        | `String`                         | **Required**       | Name of the team member. It can (and should) include surnames |  
| user        | `String`                         | **Required**       | Username of the team member. It is the login name for the person. |  
| email       | `String`                         | **Required**       | Email of the team member. |  
| roles       | [`Role[]`](#role)   | Optional       | List of roles assigned to the member. |  
| x-itop-default-password       | `String`   | Optional       | If the user is going to be imported on ITop and it is not going to be an externalUser, you can choose this account's password with this property. It must contains at least 8 characters, 1 number, 1 uppercase, 1 lowercase and 1 special character. If this property is not defined, by default the password will be **changeMe1@** |  
| x-itop-external       | `Boolean`   | Optional       | If the user is going to be imported on ITop, you can choose the account's type. If the property is ***true***, the user will be imported as an ExternalUser. In case the property is not defined or it is false, it will be imported as LocalUser. |  
| x-itop-profiles     | [`ITopProfile[]`](#itopprofile) | Optional       | In addition to all ITop profiles associated with the team that the user inherits, you can add some private profiles to it using this property. |

---

### `Role`  

| Field name  | Field type  | Required/Optional  | Description  |  
|------------ |----------- |------------------- |------------- |  
| name        | `String`    | **Required**       | Role name (e.g., "Developer, Student, Manager, etc"). |  

---

### `Service`  

| Field name  | Field type                        | Required/Optional  | Description  |  
|------------ |---------------------------------|------------------- |------------- |  
| name        | `String`                         | **Required**       | Name of the service. It must be unique |  
| description | `String`                         | Optional       | Description of the service. |  
| x-redmine-state | `String`                     | Optional       | Name of the state associated with the service. Remember that each service must have just only one state. It is necessary when importing a redmine type state service chain. |  
| x-redmine-tickets-types | [`TicketTypeEnum[]`](#tickettypeenum) | Optional | List of Redmine ticket types applicable to the service. It is necessary when importing a redmine type state service chain. |  
| teams       | [`TeamObject[]`](#teamobject)    | Optional       | List of teams responsible for the service. This teams must belong to the organization. |  
| providers   | [`ProviderObject[]`](#providerobject) | Optional       | List of providers needed for the service. |  
| customers   | [`CustomerObject[]`](#customerobject) | Optional       | List of customers for the service. |  

---

### `TeamObject`

| Field name  | Field type  | Required/Optional  | Description  |  
|------------ |----------- |------------------- |------------- |  
| name        | `String`    | **Required**       | It is the **name** of the organization team that manages this service. |  

---

### `ProviderObject`  

This object represents the organization, service and SLA needed to provide a service.

| Field name  | Field type  | Required/Optional  | Description  |  
|------------ |----------- |------------------- |------------- |  
| name        | `String`    | **Required**       | Name of the provider organization. It is the name of the organization that is responsible of being able to provide this service. Remember that this references an  existing organization in the yaml file. It is only allowed to reference organization by it's name. Writting here the provider organization code is not valid and will be interpreted as introducing an invalid name. |  
| service     | `String`    | **Required**       | Name of the provider organization service needed to provide this service. |  
| sla         | `String`    | **Required**       | It is the **name** of the SLA associated with the provider and the customer of this service. Remember that this SLA is different from the SLA that has the service that needs this provider`s service. |  

---

### `CustomerObject`  

This object represents the organization, and SLA that are clients from this service.

| Field name  | Field type  | Required/Optional  | Description  |  
|------------ |----------- |------------------- |------------- |  
| name        | `String`    | **Required**       | Name of the customer organization. It is the name of the organization that is the client from this service. Remember that this references an  existing organization in the yaml file. It is only allowed to reference organization by it's name. Writting here the customer organization code is not valid and will be interpreted as introducing an invalid name. |  
| sla         | `String`    | **Required**       | It is the **name** of the SLA associated with the customer and this service's organization. |  

---

### `TicketTypeEnum`  

Defines the possible values for Redmine ticket types. This is a conceptual type, which means there are no incorrect values. Do not forget that there is only one state allowed per service.

| Value  | Description  |  
|----------------------------- |------------------------------------ |  
| `Your ticket type 1`  | First ticket type of your service chain |  
| `Your ticket type 2`  | Second ticket type of your service chain |  
| `Your ticket type 3`          | Third ticket type of your service chain |  

## SLA Objects

Each SLA defined in **sla** section must contain the following atributes and schema.

### SLA Object  

| Field name  | Field type                        | Required/Optional  | Description  |  
|------------ |-------------------------------- |------------------- |------------- |  
| name        | `String`                         | **Required**       | Name of the SLA. |  
| guarantees  | [`GuaranteesObject[]`](#guaranteesobject)  | **Required**       | List of guarantees defining the scope and objectives of the SLA. |  

---

### `GuaranteesObject`  

| Field name  | Field type                         | Required/Optional  | Description  |  
|------------ |-------------------------------- |------------------- |------------- |  
| scope       | [`ScopeObject`](#scopeobject)       | **Required**       | Defines the scope of the guarantee, including the type of request depending on the tool where you want to import the chain. |  
| objectives  | [`ObjectivesObject`](#objectivesobject) | **Required**       | Specifies the objectives, including time-to-ownership (TTO) and time-to-resolution (TTR). |  

---

### `ScopeObject`  

In scope we must define some specific tool configuration. When preparing the yaml for redmine importation we only need to include x-redmine-tickets-type. Remember that this value must be one of the ticket types defined in the chain. When using ITop, it is needed to specify priority and request type.

| Field name               | Field type  | Required/Optional  | Description  |  
|------------------------- |----------- |------------------- |------------- |  
| x-redmine-tickets-type  | `String`    | Optional       | Type of ticket in Redmine associated with the SLA guarantee. |  
| x-itop-priority  | [`ITopPriority`](#itoppriority)    | Optional       | Type of priority in ITop associated with the SLA guarantee. |  
| x-itop-request-type  | [`ITopRequestType`](#itoprequesttype)    | Optional       | Type of request in ITop associated with the SLA guarantee. |

---

### `ITopPriority`  

Defines the possible values for ITop priority types.  

| Value  | Description  |  
|----------------------------- |------------------------------------ |  
| `1`  | It represents ***critical*** priority in ITop. |  
| `2`  | It represents ***high*** priority in ITop. |  
| `3`          | It represents ***medium*** priority in ITop. |  
| `4`          | It represents ***low*** priority in ITop. |  
| `*`          | It represents ***all*** priorities in ITop. It is a special value that simplifies notation |  

### `ITopRequestType`

Defines the possible values for ITop requests types.  

| Value  | Description  |  
|----------------------------- |------------------------------------ |  
| `incident`  | It represents ***Incident*** requests in ITop. |  
| `user_request`  | It represents ***UserRequest*** requests in ITop. |  
| `*`          | It represents ***both*** request types in ITop. It is a special value that simplifies notation |  

### `ObjectivesObject`  

| Field name  | Field type                          | Required/Optional  | Description  |  
|------------ |-------------------------------- |------------------- |------------- |  
| tto        | [`TimeConstraintObject`](#timeconstraintobject) | **Required**       | Defines the maximum allowed time for time-to-ownership (TTO). |  
| ttr        | [`TimeConstraintObject`](#timeconstraintobject) | **Required**       | Defines the maximum allowed time for time-to-resolution (TTR). |  

---

### `TimeConstraintObject`  

| Field name  | Field type  | Required/Optional  | Description  |  
|------------ |----------- |------------------- |------------- |  
| max.value  | `Integer`   | **Required**       | Maximum time allowed for the SLA objective. Must be greater than 0 |  
| max.unit   | [`TimeUnitEnum`](#timeunitenum)    | **Required**       | Unit of time measurement |  

### `TimeUnitEnum`  

Defines the possible values for time units.  

| Value  | Description  |  
|-------- |------------- |  
| `days`   | Represents days as a unit of time. |  
| `hours`  | Represents hours as a unit of time. |
