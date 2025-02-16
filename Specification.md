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
