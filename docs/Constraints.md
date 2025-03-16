# Constraints

In this section we are going to describe all validations related to SCModel in order to have a correct service chain.

+ Each organization name referenced in customers amd providers  ***MUST*** exist in ***orgs array***.

+ Each SLA referenced by its name in the file ***MUST*** exist in ***sla array***, including *initial-sla*.

+ The prefix ***_DEPRECATED_*** is not allowed when naming anything in the service chain.

+ The service chain ***MUST*** contain a single service chain. You cannot model two different service chains all together in the same file.

+ Service chain model ***cannot*** have suborganizations. This type of service chains
must be translated in order to be supported.

+ The ownership-type default value is 'state'.

+ The ownership-type has really strong implications in TTO and TTR calculations,
which implies that it is common for all issues created.

+ In order to have access to configuration as ownership-type, initial services,
terminal services, initial-sla, and many others, your service chain
must be type 'state'.

+ In order to define teams and in profit of a better monitorization, each service must have
a maximun of 1 and only one team.

+ In type state chains, each service must have ONLY ONE state.
