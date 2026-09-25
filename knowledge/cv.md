# CV

## Current role

**IBM — Software Engineer / Application Developer** · Casablanca, Morocco · March 2023 – Present

Two tracks: customer-facing production applications for a **major international airline**, and **Energy Data Hub**, a reusable IBM asset for a US utilities client. **SMOC** is another asset in the same portfolio.

On Energy Data Hub, I work as both the **solution designer/architect and implementing engineer** for the features I own. I study the full feature first — data model, API surface, AWS resources, permissions and UI flows — write the backend and frontend design, present it to stakeholders, incorporate their feedback, and implement the approved solution end to end.

**Platform scope**

* AWS monorepo of ~17 deployable services: Angular 21 UI, Node.js API on ECS Fargate, Node.js and Python Lambdas behind API Gateway, EMR Serverless (Spark), MSK/Kafka, Aurora/RDS, DynamoDB, S3, Step Functions and Cognito — provisioned through CloudFormation templates.
* Distributed engineering team of ~10 across Morocco, India and the US.
* Four environments plus a separate customer-service region: NonProd, QAS, Demo and Production.

**Energy Data Hub features owned end to end**

* Workspace-scoped **rules and rulesets management**: CSV rule import with column mapping, ruleset linking and execution-priority modelling, plus a dependency explorer showing the impact of a rule change before it is saved.
* **Schema management**: Spark/JSON schema definition, field typing, Kafka subject binding, and workspace/global catalogue scoping.
* **Spark job runs**: launch jobs against EMR Serverless, live status polling, driver-log streaming and cancellation.
* **Members, invitations and role-based access**, with authorization enforced per workspace and per resource.
* The platform's **shared Angular component library and design-token theme**, used across its pages.

**Major airline customer applications**

* Production customer journeys including **Manage My Booking, seat selection and interactive seat maps, flight status, airport maps, meal pre-order, check-in and boarding pass, and identity verification**.
* Complex stateful flows across passengers, itineraries, flights and seats, integrated with REST and GraphQL services.
* Authentication using **AWS Amplify and Amazon Cognito**, including OAuth/OIDC Authorization Code with PKCE, redirect-based sign-in and access-token-based API authentication.
* Shared UI component development used across multiple customer journeys.

## Responsibilities

**Solution design and stakeholder work**

* Analyse a feature end to end before proposing a solution: current data model, Lambda and API behaviour, AWS resources, permission model and every UI flow it touches — including backend gaps rather than treating the work as frontend-only.
* Produce technical designs covering API contracts, data and table changes, page and component structure, authorization rules and migration paths for existing records.
* Present proposals to stakeholders, explain and defend technical trade-offs, incorporate feedback and implement the approved solution across the frontend and backend.
* Identify consequences that may not be visible in a demo, including workspace/resource-level authorization, token validation, backward compatibility and the impact of schema or execution-priority changes.

**Frontend engineering**

* Angular 21 and TypeScript: standalone components, signals, OnPush change detection, container/presenter separation and typed API clients generated from OpenAPI specifications.
* Build stateful workflows rather than isolated widgets, including multi-step import wizards, live-polling dashboards with log tailing, dependency explorers, seat maps and booking workflows.
* Develop and maintain the shared component library and design-token theme, including tables, modals, drawers, selects, chips, empty states and skeleton states.
* Use RxJS and NgRx for asynchronous state, loading/error/success handling and cross-page coordination.
* Implement internationalisation, responsive layouts and keyboard/ARIA behaviour in customer-facing interfaces.

**Backend and cloud**

* Develop Node.js and Python Lambdas behind API Gateway and a containerised Node.js API service running on ECS Fargate.
* Implement Cognito authentication and authorization, including Authorization Code with PKCE, pre-token and post-confirmation triggers, JWT validation, API keys and workspace/resource-scoped permissions.
* Work across Aurora/RDS, DynamoDB, S3, Kafka topics and subjects on MSK, and EMR Serverless Spark submission and monitoring.
* Define AWS infrastructure through CloudFormation templates for the relevant resource types and deploy through the team's scripted pipeline.

**Delivery and operations**

* Own UI delivery through container-image build, ECR push, CloudFormation update of the ECS task/service and verification of the resulting running service.
* Move features through NonProd, QAS, Demo and Production and support the functionality after release.
* Conduct code reviews and technical discussions, run stakeholder demos and mentor less-experienced developers.

## Earlier roles

**Majorel — Content & Policy Consultant** · August 2017 – October 2022 · part-time

Five years of part-time professional experience alongside university, applying platform content policies at scale under review targets.
*[Add: scale handled, tooling, and any quality, escalation or mentoring responsibilities.]*

**EXPERTISE DATA — Intern** · June 2022 – August 2022

*[Add: what you built, the stack, and what shipped.]*

**A6NEGOCE — Intern** · June 2021 – August 2021

*[Add: what you built, the stack, and what shipped.]*

## Education

**EMSI — Engineering Degree, MIAGE (Méthodes Informatiques Appliquées à la Gestion)** · 2018 – 2023

Engineering education combining software engineering, information systems and business-oriented computing.

Relevant project work:

* Spring Boot / Spring Cloud microservices.
* OpenAI-integrated Spring application.
* Django decision-support dashboard.

## Certifications

**AWS Certified AI Practitioner (AIF-C01)** — Amazon Web Services, 2026

Covers AI/ML foundations, generative AI, AWS AI services, responsible AI and applied AI use cases on AWS.

## Tools and stack

**Daily** — Angular 21, TypeScript, RxJS, SCSS, REST/OpenAPI-generated clients, Git, pull-request review, Node.js, AWS (Cognito, Lambda, API Gateway, ECS/ECR, S3, CloudFormation).

**Regular** — NgRx, Angular Material/CDK, GraphQL, Python, Aurora/RDS, DynamoDB, MSK/Kafka, EMR Serverless/Spark, Step Functions, Docker/Podman container builds, CI/CD across UAT and production, AWS Amplify, shared component libraries and Storybook.

**Familiar / project experience** — Java, Spring Boot, Spring Cloud, Django, MySQL, SQL Server, Lambda@Edge, Mapbox GL, ECharts.
