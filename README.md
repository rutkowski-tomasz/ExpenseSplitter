# ExpenseSplitter

The project name is almost self-explanatory it helps with spliting expenses. It enables a very convenient settlement of costs. Perfect for trips, holidays, monthly housing expenses. It becomes really usefull when expenditures are divided not evenly between many people.

## Technologies

This project consits of both frontend and backend. To build the components Angular 8 and .Net Core 3.1 were used respectively. Both components were containerized using Docker.

## Starting the project

These instructions will get you a copy of the project up and running. See [Development setup](#development_setup) for notes on how to prepare environment for development and testing purposes.

The project components have been dockerized therefore the only prerequisite is installed **[Docker]**. To start simply run the below command:

Set environment variables to configure database (Run cmd as administrator, make sure terminal is restarted before building docker-compose)
```
setx MySql_Database "db" /M
setx MySql_User "user" /M
setx MySql_Password "password" /M
setx ConnectionStrings__Context "Server=0.0.0.0;Database=db;User=user;Password=password;" /M
```

Build and start:
```
docker-compose -f docker-compose.dev.yml up --build
```

## Development setup

Requirements:
* [.NET Core 3.1](https://dotnet.microsoft.com/download)
* [Node](https://nodejs.org/en/)
* Connection to database (Set connection string to environment variable `ConnectionStrings__Context`, e.g. `Server=localhost;Database=db;User=user;Password=password;`)

Simply follow the instructions to run ExpenseSplitter from source.

### Installing dependencies

Frontend (ExpenseSplitter.Frontend\ExpenseSplitter.Web):
```
npm install
```

Backend (ExpenseSplitter.Backend\ExpenseSplitter.Tests) - run restore on tests project because it includes Api and will restore all packages:
```
dotnet restore
```

### Running tests (optional)

Frontend (ExpenseSplitter.Frontend\ExpenseSplitter.Web):
```
npm run lint
npm run test
```

Backend (ExpenseSplitter.Backend\ExpenseSplitter.Tests):
```
dotnet test
```

### Starting project

Frontend (ExpenseSplitter.Frontend\ExpenseSplitter.Web):
```
npm run start # development purpose only
npm run build-production # use http server for production
```

Backend (ExpenseSplitter.Backend\ExpenseSplitter.Api):
```
dotnet run # environment is set by environment variable (ENVIRONMENT=Development,Production)
```
